import { IGetPayload } from './results';

export enum WeekTypes {
  // TODO: Add more types
  common,
  holiday,
}

export interface WeekInfo {
  first: number;
  selected: number;
  last: number;
  type: WeekTypes;
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
