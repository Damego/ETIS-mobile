import { IGetPayload } from "./results";

export interface IDisciplineAbsences {
  dates: string[];
  subject: string;
  type: string;
  teacher: string;
}
  
export interface IPeriodAbsences {
  absences: IDisciplineAbsences[];
  period: number;
  overallMissed: number;
}

export interface IGetAbsencesPayload extends IGetPayload {
  period?: number;
}