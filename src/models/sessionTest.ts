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

export interface ISessionTestMeta {
  p_course: string;
  p_dis_id: string;
  p_peo_id: string;
  p_que_str: string;
  p_term: string;
  p_ty_id: string;
}

export interface ISessionTest {
  meta: ISessionTestMeta;
  teacher: ISessionTestTeacher;
  themes: ISessionTestTheme[];
}

export interface ISessionTestLink {
  name: string;
  url?: string;
}