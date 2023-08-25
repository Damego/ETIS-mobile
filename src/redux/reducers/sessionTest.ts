import { IAnswer } from '../../models/sessionQuestionnaire';

export enum SessionTestStep {
  none,
  setTeacher,
  showThemeTitle,
  showThemeQuestions,
  End
}

export interface SessionTestState {
  step: SessionTestStep;
  answers: IAnswer[];
  teacherName?: string;
}

const initialState: SessionTestState = {
  step: SessionTestStep.none,
  answers: [],
}

const settingSlice =