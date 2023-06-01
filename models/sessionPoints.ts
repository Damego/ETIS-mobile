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
  hasPoints: boolean;
}

export interface ISubject {
  name?: string;
  checkPoints: ICheckPoint[];
  totalPoints: number;
  mark?: string;
}

export interface ISessionSignsData {
  subjects: ISubject[];
  currentSession: number;
  latestSession: number;
  sessionName: string;
}