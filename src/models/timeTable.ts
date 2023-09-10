import { IGetPayload } from './results';

export enum DistancePlatformTypes {
  unknown,
  bbb,
  zoom
}

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

export interface DistancePlatform {
  name: string;
  type: DistancePlatformTypes;
  url: string;
  imageUrl: string;
}

export interface ILesson {
  subject: string;
  audienceText?: string;
  audience?: string;
  building?: string;
  floor?: string;
  isDistance: boolean;
  distancePlatform?: DistancePlatform;
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
