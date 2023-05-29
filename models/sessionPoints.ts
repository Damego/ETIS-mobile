export interface ICheckPoint {
  theme: string;
  typeWork: string;
  typeControl: string;
  points: number;
  passScore: number;
  currentScore: number;
  maxScore: number;
  date: string;
  teacher: string;
  isAbsent: boolean;
  isIntroductionWork: boolean;
}

export interface ISubject {
  name?: string;
  checkPoints: ICheckPoint[];
  totalPoints: number;
  mark?: string;
}

export interface ISessionPoints {
  subjects: ISubject[];
  currentSession: number;
  latestSession: number;
  sessionName: string;
}