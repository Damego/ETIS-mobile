import { IGetPayload } from './results';

export enum WeekTypes {
  common,
  session,
  holiday,
  practice,
  elective
}

export interface WeekDates {
  start: string,
  end: string,
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
  audience: string;
  subject: string;
  time: string;
  lessonPosition: number;
}

export interface ITimeTableDay {
  date: string;
  lessons: ILesson[];
}

export interface ITimeTable {
  weekInfo: WeekInfo;
  days: ITimeTableDay[];
}

export interface ITimeTableGetProps extends IGetPayload {
  week?: number;
}
