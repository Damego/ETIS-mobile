export interface IDiscipline {
  name: string;
  mark?: string;
  date?: string;
  teacher?: string;
}

export interface ISessionMarks {
  session: number;
  course: number;
  endDate: string;
  disciplines: IDiscipline[];
}