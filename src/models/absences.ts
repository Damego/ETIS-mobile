import { IGetPayload } from "./results";

export interface IDisciplineAbsences {
  number: number;
  time: string;
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