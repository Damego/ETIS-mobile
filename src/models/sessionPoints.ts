export interface ICheckPoint {
  theme: string;
  typeWork: string;
  typeControl: string;
  points: number;
  passScore: number;
  currentScore: number;
  maxScore: number;
  date: string;
  updatesUrl: string;
  teacher: string;
  isAbsent: boolean;
  isIntroductionWork: boolean;
  hasPoints: boolean;
  failed: boolean;
}

export interface ISubjectPoints {
  name?: string;
  checkPoints: ICheckPoint[];
  totalPoints: number;
  mark?: string | null;
}

export interface ISessionPoints {
  subjects: ISubjectPoints[];
  currentSession: number | null;
  latestSession: number | null;
  sessionName: string | null;
}
