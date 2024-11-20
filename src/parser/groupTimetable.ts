import cheerio from 'cheerio';
import dayjs from 'dayjs';
import { ITeacherInfo } from '~/models/groupTimetable';
import {
  IAudience,
  IPair,
  ISubject,
  ITimeTable,
  ITimeTableDay,
  WeekInfo,
} from '~/models/timeTable';
import { dateRegex, disciplineRegex } from '~/parser/regex';
import { getDisciplineType, getTextField } from '~/parser/utils';
import { lyceumBellSchedule } from '~/screens/etis/bellSchedule/lyceumBellSchedule';
import { BellScheduleTypes, IBellSchedulePair } from '~/screens/etis/bellSchedule/types';
import { universityBellSchedule } from '~/screens/etis/bellSchedule/universityBellSchedule';
import { MAIN_ETIS_URL } from '~/utils/consts';

const audienceRegex = /ауд-([\dа-яА-Я\s]+)(?:\/(\d+))?/;

const parseWeekInfo = ($: cheerio.Root, element: cheerio.Cheerio): WeekInfo => {
  const METADATA_LENGTH = 4;
  const datesExec = $('script').last().text().match(dateRegex);

  if (datesExec == null) {
    throw new Error('No data');
  }

  const [weekStartDate, weekEndDate] = datesExec;

  const data = element
    .find('table')
    .find('tr')
    .eq(1)
    .find('td')
    .eq(1)
    .contents()
    .filter(function () {
      return this.type !== 'text' && this.name !== 'br';
    });
  const firstWeek = Number(getTextField(data.eq(1)));
  const lastWeek = Number(getTextField(data.eq(data.length - METADATA_LENGTH - 1)));
  const selectedWeek = Number(getTextField(data.filter('font').eq(0)));

  return {
    dates: {
      start: weekStartDate,
      end: weekEndDate,
    },
    first: firstWeek,
    last: lastWeek,
    selected: selectedWeek,
  };
};

const parseSubject = (stringSubject: string) => {
  const execArr = disciplineRegex.exec(stringSubject);

  const subject: ISubject = {
    string: stringSubject,
  };
  if (execArr) {
    const [, discipline, type] = execArr;
    subject.discipline = discipline;
    subject.type = getDisciplineType(type);
  }
  return subject;
};

const parseAudience = (stringAudience: string): IAudience => {
  const execArr = audienceRegex.exec(stringAudience);
  const [, number, building] = execArr;
  return {
    string: stringAudience.slice(0, stringAudience.length - 3),
    number,
    building,
    floor: !Number.isNaN(Number(number[0])) ? number[0] : null,
  };
};
const generateNextDayDateString = (date: dayjs.Dayjs, value: number) =>
  date.add(value, 'day').format('DD.MM.YYYY');

const parseTeachers = ($: cheerio.Root, table: cheerio.Cheerio) => {
  const teachers: ITeacherInfo[] = [];

  table.children().each((_, rowElement) => {
    const rowTag = $(rowElement);
    rowTag.children().each((_, teacherElement) => {
      const teacherTag = $(teacherElement);

      let name = '';
      teacherTag
        .find('td')
        .eq(1)
        .contents()
        .each(function (index, element) {
          if (this.type === 'text') {
            const text = getTextField($(element));
            if (text.startsWith('(')) return false;
            name += text;
          }
          if (this.name === 'br') name += ' ';
        });

      const [first, middle, last] = name.split(' ');

      const teacherImage = teacherTag.find('img');
      const imageSource = teacherImage.attr('src').replace('..', '');
      const photoUrl = `${MAIN_ETIS_URL}/pls${imageSource}`;
      const [, , photoLoadedDate] = teacherImage.attr('alt').split(' ');
      teachers.push({
        name,
        shortName: `${first} ${middle.charAt(0)}.${last.charAt(0)}.`,
        photoUrl,
        photoLoadedDate,
      });
    });
  });

  return teachers;
};

export const parseGroupTimetable = (html: string): ITimeTable => {
  const $ = cheerio.load(html);
  const timetable = {} as ITimeTable;
  const mainTable = $('table').eq(0);

  const dataRows = mainTable.find('tbody').eq(0).children();

  try {
    timetable.weekInfo = parseWeekInfo($, dataRows.eq(0));
  } catch (e) {
    return null;
  }

  const teachers = parseTeachers($, dataRows.eq(1).children().eq(1).children().find('tbody').eq(0));
  const date = dayjs(timetable.weekInfo.dates.start, 'DD.MM.YYYY');
  let dayIndex = -1;
  const days: ITimeTableDay[] = [];
  let isLyceum = getTextField(
    dataRows.eq(0).find('table').find('td').eq(0).contents().eq(2)
  ).startsWith('Лицей');

  const pairTimes = (isLyceum ? lyceumBellSchedule : universityBellSchedule).filter(
    (item) => item.type === BellScheduleTypes.PAIR
  ) as IBellSchedulePair[];

  dataRows
    .eq(1)
    .find('tbody')
    .eq(0)
    .children()
    .each((index, element) => {
      const tag = $(element);
      if (index === 0) return;

      let pairPosition: number;

      const ths = tag.find('th');
      if (ths.length === 2) {
        dayIndex += 1;
        pairPosition = Number(getTextField(ths.eq(1)));
      } else {
        pairPosition = Number(getTextField(ths.eq(0)));
      }
      const pair: IPair = {
        time: pairTimes[pairPosition - 1].start,
        lessons: tag
          .find('table')
          .map((_, tableElement) => {
            const pairTable = $(tableElement);
            const trs = pairTable.find('tr');
            const stringSubject = getTextField(trs.eq(0));
            const stringAudience = getTextField(trs.eq(2));
            const stringTeacher = getTextField(trs.eq(1).find('font').eq(0));
            const audience = parseAudience(stringAudience);

            return {
              subject: parseSubject(stringSubject),
              audience,
              isDistance: audience.number === 'Дистанционно',
              // TODO: Поддержка нескольких преподавателей
              teacher: {
                name:
                  teachers.find((teacher) => teacher.shortName === stringTeacher)?.name ??
                  stringTeacher,
              },
            };
          })
          .get(),
        position: pairPosition,
      };

      if (days.length - 1 !== dayIndex) {
        days.push({
          pairs: [],
          date:
            dayIndex === 0
              ? timetable.weekInfo.dates.start
              : generateNextDayDateString(date, dayIndex),
        });
      }
      if (pair.lessons.length) days[dayIndex].pairs.push(pair);
    });
  timetable.days = days;
  return timetable;
};
