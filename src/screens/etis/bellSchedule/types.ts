export enum BellScheduleTypes {
  PAIR,
  BREAK,
}

export interface IBellSchedulePair {
  type: BellScheduleTypes.PAIR;
  start: string;
  end: string;
  number: number;
}

export interface IBellScheduleBreak {
  type: BellScheduleTypes.BREAK;
  number: number;
}

export type IBellSchedule = IBellSchedulePair | IBellScheduleBreak;

export enum BellScheduleModes {
  UNIVERSITY,
  LYCEUM,
  SKI_BASE,
}
