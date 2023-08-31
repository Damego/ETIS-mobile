import { IGetPayload } from './results';

export interface IDefaultTeacher {
  name: string;
  id: string;
}

export interface IAnswer {
  id: string;
  value: string;
}

export interface IQuestion {
  name: string;
  answers: IAnswer[];
}

export interface ITheme {
  title: string;
  answerTitles: string[];
  questions: IQuestion[];
}

export interface IMetaData {
  p_course: string;
  p_dis_id: string;
  p_peo_id: string;
  p_que_str: string;
  p_term: string;
  p_ty_id: string;
}

export interface ISessionQuestionnaire {
  meta: IMetaData;
  teacher: IDefaultTeacher;
  themes: ITheme[];
}

export interface ISessionQuestionnaireLink {
  name: string;
  url?: string;
}

export interface IGetStringPayload extends IGetPayload {
  data: string;
}