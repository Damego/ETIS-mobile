export enum DistancePlatformTypes {
  unknown,
  bbb,
  zoom,
  skype,
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
  dates?: WeekDates;
  holidayDates?: WeekDates;
}

export interface DistancePlatform {
  name: string;
  type: DistancePlatformTypes;
  url: string;
  imageUrl: string;
}

export interface ITeacher {
  id?: string;
  name: string;
}

export interface ISubject {
  string: string;
  discipline?: string;
  type?: string;
}

export interface IAudience {
  string: string;
  number?: string;
  building?: string;
  floor?: string;
}

export interface ILesson {
  subject: ISubject;
  audience: IAudience;
  isDistance: boolean;
  distancePlatform?: DistancePlatform;
  teacher?: ITeacher;
  announceHTML?: string;
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
