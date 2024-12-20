import dayjs from 'dayjs';
import { CalendarResponse, VEvent } from 'node-ical';
import { IAudience, IPair, ISubject, ITimeTable, ITimeTableDay } from '~/models/timeTable';
import { disciplineRegex } from '~/parser/regex';
import { getDisciplineType } from '~/parser/utils';
import { lyceumBellSchedule } from '~/screens/etis/bellSchedule/lyceumBellSchedule';
import { IBellSchedulePair } from '~/screens/etis/bellSchedule/types';
import { universityBellSchedule } from '~/screens/etis/bellSchedule/universityBellSchedule';
import { compareTime, formatTime, getEducationWeekByDate } from '~/utils/datetime';

type VEventDayjs = VEvent & { start: dayjs.Dayjs };

const convertEventToPair = (event: VEventDayjs, isLyceum: boolean): IPair => {
  const pair: IPair = {};
  pair.time = formatTime(event.start, { disableDate: true });
  pair.position = (
    isLyceum
      ? lyceumBellSchedule.find((item: IBellSchedulePair) => item.start === pair.time)
      : universityBellSchedule.find((item: IBellSchedulePair) => item.start === pair.time)
  ).number;

  const execArr = disciplineRegex.exec(event.summary);
  const subject: ISubject = {
    string: event.summary,
  };
  if (execArr) {
    const [, discipline, type] = execArr;
    subject.discipline = discipline.replaceAll('&quot;', '"');
    subject.type = getDisciplineType(type);
  }

  const rawAudienceString = event.location;
  let audience: IAudience;

  if (rawAudienceString.includes('ПГНИУ')) {
    const [, buildingString, numberString] = rawAudienceString.split(',').map((s) => s.trim());

    audience = {
      string: rawAudienceString,
      number: numberString.split('/').at(0),
      building: buildingString.split(' ').at(0),
      floor: numberString[0],
    };
  } else {
    audience = {
      string: rawAudienceString,
    };
  }

  const [teacher, announce] = event.description.split('\n\n');

  pair.lessons = [
    {
      subject,
      audience,
      teacher: {
        name: teacher,
      },
      announceHTML: announce,
      isDistance: rawAudienceString === 'Дистанционно',
    },
  ];

  return pair;
};

export const convertICalToTimetable = (ical: CalendarResponse, isLyceum: boolean) => {
  const icalData: VEventDayjs[] = Object.values(ical)
    .filter((component) => component.type === 'VEVENT')
    .map((event: VEventDayjs) => {
      const date = dayjs(event.start);
      event.start = date;
      return event;
    })
    .sort((a, b) => compareTime(a.start, b.start));

  const data: { [week: number]: { [dayDate: string]: VEvent[] } } = {};

  icalData.forEach((event) => {
    const week = getEducationWeekByDate(event.start);
    if (data[week] === undefined) {
      data[week] = {};
    }
    const startDate = event.start.startOf('date').toISOString();

    if (data[week][startDate] === undefined) {
      data[week][startDate] = [];
    }

    data[week][startDate].push(event);
  });

  const weeks = Object.keys(data);
  const firstWeek = Number(weeks.at(0));
  const lastWeek = Number(weeks.at(-1));

  const timetable: ITimeTable[] = [];

  Object.entries(data).forEach(([week, daysData]) => {
    let weekDate: dayjs.Dayjs = null;

    const days: ITimeTableDay[] = [];
    Object.entries(daysData).forEach(([date, events]) => {
      if (!weekDate) {
        weekDate = dayjs(date);
      }
      days.push({
        date: formatTime(dayjs(date), { disableTime: true }),
        pairs: events.map((event: VEventDayjs) => convertEventToPair(event, isLyceum)),
      });
    });

    timetable.push({
      weekInfo: {
        selected: Number(week),
        first: firstWeek,
        last: lastWeek,
        dates: {
          start: weekDate.startOf('isoWeek').format('DD.MM.YYYY'),
          end: weekDate.endOf('isoWeek').format('DD.MM.YYYY'),
        },
      },
      days,
    });
  });

  return timetable;
};
