import { BellScheduleTypes, IBellSchedule } from './types';

export const lyceumBellSchedule: IBellSchedule[] = [
  {
    type: BellScheduleTypes.PAIR,
    start: '8:00',
    end: '8:40',
    number: 1,
  },
  {
    type: BellScheduleTypes.BREAK,
    number: 10,
  },
  {
    type: BellScheduleTypes.PAIR,
    start: '8:50',
    end: '9:30',
    number: 2,
  },
  {
    type: BellScheduleTypes.BREAK,
    number: 15,
  },
  {
    type: BellScheduleTypes.PAIR,
    start: '9:45',
    end: '10:25',
    number: 3,
  },
  {
    type: BellScheduleTypes.BREAK,
    number: 10,
  },
  {
    type: BellScheduleTypes.PAIR,
    start: '10:35',
    end: '11:15',
    number: 4,
  },
  {
    type: BellScheduleTypes.BREAK,
    number: 15,
  },
  {
    type: BellScheduleTypes.PAIR,
    start: '11:30',
    end: '12:10',
    number: 5,
  },
  {
    type: BellScheduleTypes.BREAK,
    number: 10,
  },
  {
    type: BellScheduleTypes.PAIR,
    start: '12:20',
    end: '13:00',
    number: 6,
  },
  {
    type: BellScheduleTypes.BREAK,
    number: 30,
  },
  {
    type: BellScheduleTypes.PAIR,
    start: '13:30',
    end: '14:10',
    number: 7,
  },
  {
    type: BellScheduleTypes.BREAK,
    number: 10,
  },
  {
    type: BellScheduleTypes.PAIR,
    start: '14:20',
    end: '15:00',
    number: 8,
  },
  {
    type: BellScheduleTypes.BREAK,
    number: 15,
  },
  {
    type: BellScheduleTypes.PAIR,
    start: '15:15',
    end: '15:55',
    number: 9,
  },
  {
    type: BellScheduleTypes.BREAK,
    number: 10,
  },
  {
    type: BellScheduleTypes.PAIR,
    start: '16:05',
    end: '16:55',
    number: 10,
  },
];