import { ITimeTable } from '~/models/timeTable';

export enum TimetableTypes {
  sessions,
  weeks,
}

export interface IPeriod {
  name: string;
  number: number; // number?
  isCurrent: boolean;
}

export interface ICathedraTimetable {
  type: TimetableTypes;
  periods: IPeriod[];
  timetable: ITimeTable[];
}

export interface ICathedraTimetablePayload {
  session?: number;
  week?: number;
  teacherId?: string;
  cathedraId?: string;
}
