export enum TimetableTypes {
  sessions,
  weeks,
}

export interface Session {
  name: string;
  number: number; // number?
  isCurrent: boolean;
}

export interface WeekInfo {
  first: number;
  selected: number | null;
  last: number;
}

export interface IAudience {
  standard: string;
  extended: string[];
}

export interface ILesson {
  discipline: string;
  groups: string[];
  audience: IAudience;
}

export interface IPair {
  lessons: ILesson[];
  time: string;
}

export interface IDay {
  pairs: IPair[];
}

export interface ITeacherTimetable {
  teacherName: string;
  // 0 - Понедельник, 5 - суббота
  days: IDay[];
}

export interface ICathedraTimetable {
  type: TimetableTypes;
  sessions: Session[];
  weekInfo: WeekInfo;
  timetable: ITeacherTimetable[];
}

export interface ICathedraTimetablePayload {
  session?: number;
  week?: number;
  teacherId?: string;
  cathedraId?: string;
}
