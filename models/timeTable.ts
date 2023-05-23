export interface ILesson {
  audience: string;
  subject: string;
  time: string;
  lessonPosition: number;
}

export interface ITimeTableDay {
  date: string;
  lessons: ILesson[]
}

export interface ITimeTable {
  firstWeek: number;
  selectedWeek: number;
  lastWeek: number;
  days: ITimeTableDay[]
}

export interface IGetResult {
  data: ITimeTable;
  isLoginPage?: boolean;
  fetched?: boolean;
}

export interface IGetProps {
  week?: number;
  useCache?: boolean;
  useCacheFirst?: boolean;
}