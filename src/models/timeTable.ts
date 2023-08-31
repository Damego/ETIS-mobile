import { IGetPayload } from './results';

export enum WeekTypes {
  common,
  session,
  holiday,
  practice,
  elective,
}

export interface WeekDates {
  start: string;
  end: string;
}

export interface WeekInfo {
  first: number;
  selected: number;
  last: number;
  type: WeekTypes;
  dates: WeekDates;
  holidayDates?: WeekDates;
}

export interface ILesson {
  subject: string;
  audienceText: string;
  audience: string;
  building: string;
  floor: string;
  isDistance: boolean;
}

export interface IPair {
  position: number;
  time: string;
  lessons: ILesson[];
}

export interface ITimeTableDay {
  date: string;
  pairs: IPair[];
}

export interface ITimeTable {
  weekInfo: WeekInfo;
  days: ITimeTableDay[];
}

export interface ITimeTableGetProps extends IGetPayload {
  week?: number;
}
