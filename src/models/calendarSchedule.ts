export interface ISessionSchedule {
  title: string;
  dates: string[]
}

export interface ICalendarSchedule {
  course: number;
  sessions: ISessionSchedule[];
}
