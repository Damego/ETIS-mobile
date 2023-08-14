export interface ISessionTestTeacher {
  name: string;
  id: string;
}

export interface ISessionTestAnswer {
  id: string;
  value: string;
}

export interface ISessionTestQuestion {
  name: string;
  answers: ISessionTestAnswer[];
}

export interface ISessionTestTheme {
  title: string;
  answerTitles: string[];
  questions: ISessionTestQuestion[];
}

export interface ISessionTest {
  meta: unknown;
  teacher: ISessionTestTeacher;
  themes: ISessionTestTheme[];
}

export interface ISessionTestLink {
  name: string;
  url?: string;
}