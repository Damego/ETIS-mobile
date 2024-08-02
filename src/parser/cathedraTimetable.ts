import * as cheerio from 'cheerio';
import dayjs from 'dayjs';
import { ICathedraTimetable, IPeriod, TimetableTypes } from '~/models/cathedraTimetable';
import { IAudience, ILesson, IPair, ISubject, ITeacher, WeekInfo } from '~/models/timeTable';
import { dateRegex, disciplineRegex, numberRegex } from '~/parser/regex';

import { getDisciplineType, getTextField } from './utils';

const parsePeriodsAndWeeks = ($: cheerio.Root) => {
  const data: {
    periods: IPeriod[];
    weekInfo: WeekInfo;
    type: TimetableTypes;
  } = {
    periods: [],
    weekInfo: null,
    type: null,
  };
  let periodNumber = 1;
  const $spanList = $('body').children().filter('span');

  const selected = getTextField($spanList.filter('.active').last());
  const isWeeksMode = !Number.isNaN(parseInt(selected));
  data.type = isWeeksMode ? TimetableTypes.weeks : TimetableTypes.sessions;

  $spanList.each((_index, element) => {
    const span = $(element);
    const text = getTextField(span);

    if (!Number.isNaN(parseInt(text))) {
      const rawDates = getTextField($('h4'));
      const [startDate, endDate] = rawDates.match(dateRegex);

      data.weekInfo = {
        first: parseInt(text),
        last: parseInt(getTextField($spanList.last())),
        selected: isWeeksMode ? parseInt(selected) : null,
        dates: {
          start: startDate,
          end: endDate,
        },
      };
      return false;
    }
    data.periods.push({
      name: text,
      number: periodNumber,
      isCurrent: !isWeeksMode ? span.hasClass('active') : false,
    });
    periodNumber += 1;
  });

  return data;
};

/*
  Разбирает строку и ищет аудиторию в неделе
  Пример входных данных: "1, 2, 3, 4 - 5 к. ауд.300/5"
*/
const getAudienceByWeek = (text: string, weekInfo: WeekInfo): string => {
  const [weeksRaw, audienceRaw] = text.split('-');
  const [, audience] = audienceRaw.split('к.');
  const weeks = weeksRaw.split(',').map((week) => week.trim());

  if (weeks.includes(weekInfo.selected.toString())) {
    return audience.trim();
  }
};

const getAudienceFromText = (text: string): IAudience => {
  // Регулярка каким-то образом не парсит некоторые аудитории, хотя внешне они выглядят нормально
  // и на сайте всё работает и в отдельном тестовом сценарии тоже о_О
  // ауд.123/1
  const newText = text.slice(4);
  const array = newText.split('/');
  if (array.length === 2) {
    const [number, buildingRaw] = array;
    const [building] = buildingRaw.split(' ');
    return {
      string: text,
      number,
      building,
      floor: number[0],
    };
  }
  return {
    string: text,
    number: newText,
  };
};

const parseAudience = ($: cheerio.Root, tag: cheerio.Cheerio, weekInfo: WeekInfo) => {
  let audience: IAudience;
  tag.contents().each(function (i, el: cheerio.TagElement) {
    const tag = $(el);
    if (this.type === 'text') {
      const audienceString = getAudienceByWeek(getTextField(tag), weekInfo);
      if (audienceString) {
        const aud = getAudienceFromText(audienceString);
        audience = {
          ...aud,
          info:
            (el.next as cheerio.TagElement)?.name === 'img'
              ? $(el.next).attr('title').replaceAll('<br>', '\n')
              : undefined,
        };
      }
    }
  });

  return audience;
};

const cutGroupName = (group: string) => {
  // ММ/О ММТ-2-2023 НБ
  // ММТ-23
  const [, name] = group.split(' ');
  const [speciality, , year] = name.split('-');
  return `${speciality}-${year.slice(2)}`;
};

const parsePairLessons = ($: cheerio.Root, td: cheerio.Cheerio, weekInfo: WeekInfo): ILesson[] => {
  const divs = td.children();
  if (divs.length === 0) {
    return [];
  }

  const lessons: ILesson[] = [];

  const lessonCount = td.find('hr').length + 1;
  // Интервал (в количестве тэгов) между занятиями
  const interval = 6;

  for (let i = 0; i < lessonCount; i += 1) {
    const stringSubject = getTextField(divs.eq(i * interval));

    const subject: ISubject = {
      string: stringSubject,
    };
    const execArr = disciplineRegex.exec(stringSubject);
    if (execArr) {
      const [, discipline, type] = execArr;
      subject.discipline = discipline;
      subject.type = getDisciplineType(type);
    } else {
      subject.discipline = stringSubject;
    }

    const audience = parseAudience($, divs.eq(2 + i * interval), weekInfo);
    const groups = getTextField(divs.eq(4 + i * interval)).split('\n');
    const shortGroups = [...new Set(groups.map(cutGroupName))];

    lessons.push({
      subject,
      audience,
      groups,
      shortGroups,
      isDistance: audience.number === 'Дистанционно',
    });
  }

  return lessons;
};

// Очищает список от лишних пар, т.е. пар, в которых нет уроков
const cleanupPairs = (pairs: IPair[]) => {
  let flag = true;
  let lastPair = 0;
  for (let i = 0; i < pairs.length; i += 1) {
    if (pairs[i].lessons.length) {
      flag = false;
      lastPair = i;
    }
  }
  if (flag) {
    return [];
  }

  return pairs.slice(0, lastPair + 1);
};

const generateNextDayDateString = (date: dayjs.Dayjs) => date.add(1, 'day').format('DD.MM.YYYY');

const parseTeacher = (tdTag: cheerio.Cheerio): ITeacher => {
  const teacherTextTag = tdTag.contents().eq(0);
  const [teacherId] = tdTag.find('a').attr('href').match(numberRegex);
  return {
    id: teacherId,
    name: getTextField(teacherTextTag),
  };
};

export default function parseCathedraTimetable(html: string) {
  const $ = cheerio.load(html);

  const { periods, type, weekInfo } = parsePeriodsAndWeeks($);
  const data: ICathedraTimetable = {
    periods,
    timetable: [],
    type,
  };

  let teacherIndex = -1;
  let dayIndex = -1;
  const table = $('.slimtab_nice');
  table.find('tr').each((index, element) => {
    if (index === 0) return;

    const tag = $(element);
    if (!getTextField(tag)) return;

    const tdList = tag.children();
    const firstTdTag = tdList.eq(0);
    const firstFieldIsTeacher = firstTdTag.find('a').html();
    const hasPairs = getTextField(tdList.eq(1)) !== 'Нет занятий';

    // tdList.length
    // 8 - препод + расписание для 1й пары
    // 2 - препод и нет расписания или время + 1 пара
    // 2+ - время и произвольное количество блоков с парами (обычно равно 7)
    // Для учителей лицея стуктура таблицы сильно нарушена, поэтому количество блоков разнится
    if (tdList.length === 2 && firstFieldIsTeacher) {
      teacherIndex += 1;
      data.timetable[teacherIndex] = {
        teacher: parseTeacher(firstTdTag),
        days: [],
        weekInfo,
      };
      return;
    }

    if (!hasPairs) return;

    if (tdList.length === 8) {
      teacherIndex += 1;
      dayIndex = -1;

      const date = dayjs(weekInfo.dates.start, 'DD.MM.YYYY');

      data.timetable[teacherIndex] = {
        teacher: parseTeacher(firstTdTag),
        weekInfo,
        days: [
          { pairs: [], date: weekInfo.dates.start },
          { pairs: [], date: generateNextDayDateString(date) },
          { pairs: [], date: generateNextDayDateString(date) },
          { pairs: [], date: generateNextDayDateString(date) },
          { pairs: [], date: generateNextDayDateString(date) },
          { pairs: [], date: generateNextDayDateString(date) },
        ],
      };
    } else if (tdList.length >= 2) {
      dayIndex = -1;
    }

    tdList.each((tdIndex, tdElement) => {
      if (
        (tdList.length === 8 && (tdIndex === 0 || tdIndex === 1)) ||
        (tdList.length >= 2 && tdIndex === 0)
      )
        return;

      dayIndex += 1;

      const td = $(tdElement);

      const lessons = parsePairLessons($, td, weekInfo);
      const time = getTextField(tdList.length === 8 ? tdList.eq(1) : tdList.eq(0));

      data.timetable[teacherIndex].days[dayIndex].pairs.push({
        lessons,
        time,
        position: data.timetable[teacherIndex].days[dayIndex].pairs.length + 1,
      });
    });
  });

  data.timetable.forEach((timetable) => {
    timetable.days.forEach((day) => {
      day.pairs = cleanupPairs(day.pairs);
    });
  });

  return data;
}
