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

export interface IQuestionnaireTheme {
  title: string;
  answerTitles: string[];
  questions: IQuestion[];
}

// Метаданные собираются с input'ов формы и зависят от страницы анкеты,
// поэтому парсер заполняет их динамически — все поля опциональны.
export interface IMetaData {
  p_course?: string;
  p_dis_id?: string;
  p_peo_id?: string;
  p_que_str?: string;
  p_term?: string;
  p_ty_id?: string;
  [key: string]: string | undefined;
}

export interface ISessionQuestionnaire {
  meta: IMetaData;
  teacher: IDefaultTeacher | null;
  themes: IQuestionnaireTheme[];
}

export interface ISessionQuestionnaireLink {
  name: string;
  url?: string;
}
