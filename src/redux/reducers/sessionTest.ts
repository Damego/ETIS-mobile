import { ISessionTestAnswer } from '../../models/sessionTest';

export enum SessionTestStep {
  none,
  setTeacher,
  showThemeTitle,
  showThemeQuestions,
  End
}

export interface SessionTestState {
  step: SessionTestStep;
  answers: ISessionTestAnswer[];
  teacherName?: string;
}

const initialState: SessionTestState = {
  step: SessionTestStep.none,
  answers: [],
}

const settingSlice =