import { BellScheduleTypes, IBellSchedule } from './types';

export const universityBellSchedule: IBellSchedule[] = [
  {
    type: BellScheduleTypes.PAIR,
    start: '8:00',
    end: '9:35',
    number: 1,
  },
  {
    type: BellScheduleTypes.BREAK,
    number: 10,
  },
  {
    type: BellScheduleTypes.PAIR,
    start: '9:45',
    end: '11:20',
    number: 2,
  },
  {
    type: BellScheduleTypes.BREAK,
    number: 10,
  },
  {
    type: BellScheduleTypes.PAIR,
    start: '11:30',
    end: '13:05',
    number: 3,
  },
  {
    type: BellScheduleTypes.BREAK,
    number: 25,
  },
  {
    type: BellScheduleTypes.PAIR,
    start: '13:30',
    end: '15:05',
    number: 4,
  },
  {
    type: BellScheduleTypes.BREAK,
    number: 10,
  },
  {
    type: BellScheduleTypes.PAIR,
    start: '15:15',
    end: '16:50',
    number: 5,
  },
  {
    type: BellScheduleTypes.BREAK,
    number: 10,
  },
  {
    type: BellScheduleTypes.PAIR,
    start: '17:00',
    end: '18:35',
    number: 6,
  },
  {
    type: BellScheduleTypes.BREAK,
    number: 5,
  },
  {
    type: BellScheduleTypes.PAIR,
    start: '18:40',
    end: '20:15',
    number: 7,
  },
  {
    type: BellScheduleTypes.BREAK,
    number: 10,
  },
  {
    type: BellScheduleTypes.PAIR,
    start: '20:25',
    end: '22:00',
    number: 8,
  },
];
