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

export interface IAbsenceSession {
  name: string;
  number: number;
}

export interface IAbsence {
  absences: IDisciplineAbsences[];
  currentSession: IAbsenceSession;
  sessions: IAbsenceSession[];
  overallMissed: number;
}
