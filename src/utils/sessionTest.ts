import { ISessionQuestionnaire, IAnswer, IMetaData } from '../models/sessionQuestionnaire';

export interface SessionQuestionnairePayload extends IMetaData {
  p_peo: string;
  p_teacher_fio: string;
  p_comment: string;
}

export default function toSessionTestPayload({
  data,
  teacher,
  answers,
  additionalComment,
}: {
  data: ISessionQuestionnaire;
  teacher: string;
  answers: IAnswer[];
  additionalComment: string;
}): SessionQuestionnairePayload {
  const payload: SessionQuestionnairePayload = data.meta as SessionQuestionnairePayload;

  if (teacher) {
    payload.p_peo = 'another';
    payload.p_teacher_fio = teacher;
  } else {
    payload.p_peo = payload.p_peo_id;
    payload.p_teacher_fio = '';
  }

  payload.p_comment = additionalComment || '';
  payload.p_que_str = answers.map((answer) => `${answer.id}=${answer.value}`).join('&');

  return payload;
}
