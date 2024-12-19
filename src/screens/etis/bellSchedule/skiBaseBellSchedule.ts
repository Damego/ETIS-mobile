import { BellScheduleTypes, IBellSchedule } from './types';

export const skiBaseBellSchedule: IBellSchedule[] = [
  {
    type: BellScheduleTypes.PAIR,
    start: '9:45',
    end: '10:45',
    number: 1,
  },
  {
    type: BellScheduleTypes.PAIR,
    start: '11:40',
    end: '12:40',
    number: 2,
  },
  {
    type: BellScheduleTypes.PAIR,
    start: '13:40',
    end: '14:40',
    number: 3,
  },
  {
    type: BellScheduleTypes.PAIR,
    start: '15:40',
    end: '16:40',
    number: 4,
  },
];
