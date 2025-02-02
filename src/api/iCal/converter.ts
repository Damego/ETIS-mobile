import dayjs from 'dayjs';
import { CalendarResponse, VEvent } from 'node-ical';
import { IAudience, IPair, ISubject, ITimeTable, ITimeTableDay } from '~/models/timeTable';
import { disciplineRegex } from '~/parser/regex';
import { getDisciplineType } from '~/parser/utils';
import { lyceumBellSchedule } from '~/screens/etis/bellSchedule/lyceumBellSchedule';
import { IBellSchedulePair } from '~/screens/etis/bellSchedule/types';
import { universityBellSchedule } from '~/screens/etis/bellSchedule/universityBellSchedule';
import { formatTime, getEducationWeekByDate } from '~/utils/datetime';
import { groupItems } from '~/utils/utils';

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

const fillDaysForWeek = (week: number, event: VEventDayjs) => {
  const days = [];
  const monday = event.start.startOf('isoWeek');
  for (let i = 0; i < 7; i += 1) {
    days.push({ date: monday.add(i, 'day'), events: [] });
  }
  return days;
};

const convertIcalToWeeks = (ical: CalendarResponse) => {
  const icalData: VEventDayjs[] = Object.values(ical)
    .filter((component) => component.type === 'VEVENT')
    .map((event: VEventDayjs) => {
      event.start = dayjs(event.start); // always iso
      return event;
    });

  const data: { [week: number]: { date: dayjs.Dayjs; events: VEvent[] }[] } = {};

  icalData.forEach((event) => {
    const week = getEducationWeekByDate(event.start);
    if (data[week] === undefined) {
      data[week] = fillDaysForWeek(week, event);
    }
    const startDate = event.start.startOf('date');
    const weekDays = data[week].find(({ date }) => date.diff(startDate, 'days') === 0);
    weekDays.events.push(event);
  });
  return data;
};

const fixPositionDuplicates = (pairs: IPair[]) => {
  // Не забываем, что в одно время может быть несколько пар
  const grouped = groupItems(pairs, (pair) => pair.position.toString());
  return grouped.map((pairs) => {
    if (pairs.length === 1) return pairs[0];
    const first = pairs[0];
    pairs.slice(1).forEach(($pair) => first.lessons.push(...$pair.lessons));
    return first;
  });
};

export const convertICalToTimetable = (ical: CalendarResponse, isLyceum: boolean) => {
  const data = convertIcalToWeeks(ical);

  const weeks = Object.keys(data);
  const firstWeek = Number(weeks.at(0));
  const lastWeek = Number(weeks.at(-1));

  const timetable: ITimeTable[] = [];

  Object.entries(data).forEach(([week, dayEvents]) => {
    const weekDate = dayEvents[0].date;
    const days: ITimeTableDay[] = dayEvents.map(({ date, events }) => {
      let pairs = events.map((event: VEventDayjs) => convertEventToPair(event, isLyceum));
      if (pairs.length) {
        pairs = fixPositionDuplicates(pairs);
      }

      return { date: formatTime(date, { disableTime: true }), pairs };
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
