import { GetPayload } from './results';

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
  firstWeek: number;
  selectedWeek: number;
  lastWeek: number;
  days: ITimeTableDay[];
}

export interface ITimeTableGetProps extends GetPayload {
  week?: number;
}
