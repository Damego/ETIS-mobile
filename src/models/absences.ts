import { IGetPayload } from "./results";

export interface IAbsenceDate {
  date: string;
  isCovered: boolean;
}

export interface IDisciplineAbsences {
  dates: IAbsenceDate[];
  subject: string;
  type: string;
  teacher: string;
}
  
export interface IPeriodAbsences {
  absences: IDisciplineAbsences[];
  period: number;
  periods: string[];
  overallMissed: number;
}

export interface IGetAbsencesPayload extends IGetPayload {
  period?: number;
}