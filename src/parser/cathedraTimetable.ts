import * as cheerio from 'cheerio';

import {
  IAudience,
  ICathedraTimetable,
  ILesson,
  IPair,
  TimetableTypes,
} from '../models/cathedraTimetable';
import { getTextField } from './utils';

const parseSessionsAndWeeks = ($: cheerio.Root) => {
  const data: ICathedraTimetable = {
    sessions: [],
    timetable: [],
    weekInfo: null,
    type: null,
  };
  let sessionNumber = 1;
  const $spanList = $('body').children().filter('span');

  const selected = getTextField($spanList.filter('.active').last());
  const isWeeksMode = !Number.isNaN(parseInt(selected));
  data.type = isWeeksMode ? TimetableTypes.weeks : TimetableTypes.sessions;

  $spanList.each((_index, element) => {
    const span = $(element);
    const text = getTextField(span);

    if (!Number.isNaN(parseInt(text))) {
      data.weekInfo = {
        first: parseInt(text),
        last: parseInt(getTextField($spanList.last())),
        selected: isWeeksMode ? parseInt(selected) : null,
      };
      return false;
    }
    data.sessions.push({
      name: text,
      number: sessionNumber,
      isCurrent: !isWeeksMode ? span.hasClass('active') : false,
    });
    sessionNumber += 1;
  });

  return data;
};

const parsePairLessons = ($: cheerio.Root, td: cheerio.Cheerio): ILesson[] => {
  const divs = td.children();
  if (divs.length === 0) {
    return [];
  }

  const lessons: ILesson[] = [];

  const lessonCount = td.find('hr').length + 1;
  const interval = 6;

  for (let i = 0; i < lessonCount; i += 1) {
    const discipline = getTextField(divs.eq(i * interval));

    const audienceDiv = divs.eq(2 + i * interval);
    const font = audienceDiv.find('font');
    const audience: IAudience = {
      standard: getTextField(audienceDiv),
      extended: font.attr('title') ? font.attr('title').split('<br>') : null,
    };
    const groups = getTextField(divs.eq(4 + i * interval)).split('\n');

    lessons.push({ discipline, audience, groups });
  }

  return lessons;
};

const cleanupPairs = (pairs: IPair[]) => {
  // Очищает список от лишних пар, т.е. пар, в которых нет уроков

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

export default function parseCathedraTimetable(html: string) {
  const $ = cheerio.load(html);

  const data: ICathedraTimetable = parseSessionsAndWeeks($);

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

    // 8 - препод + расписание для 1й пары
    // 2 - препод и нет расписания или время + 1 пара
    // 2+ - время и произвольное количество блоков с парами (обычно равно 7)
    if (tdList.length === 2 && firstFieldIsTeacher) {
      const teacher = firstTdTag.contents().eq(0);
      teacherIndex += 1;
      data.timetable[teacherIndex] = {
        teacherName: getTextField(teacher),
        days: [],
      };
      return;
    }

    if (!hasPairs) return;

    if (tdList.length === 8) {
      const teacher = firstTdTag.contents().eq(0);
      teacherIndex += 1;
      dayIndex = -1;

      data.timetable[teacherIndex] = {
        teacherName: getTextField(teacher),
        days: [
          { pairs: [] },
          { pairs: [] },
          { pairs: [] },
          { pairs: [] },
          { pairs: [] },
          { pairs: [] },
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

      const lessons = parsePairLessons($, td);
      const time = getTextField(tdList.length === 8 ? tdList.eq(1) : tdList.eq(0));

      data.timetable[teacherIndex].days[dayIndex].pairs.push({ lessons, time });
    });
  });

  data.timetable.forEach((timetable) => {
    timetable.days.forEach((day) => {
      day.pairs = cleanupPairs(day.pairs);
    });
  });

  return data;
}
