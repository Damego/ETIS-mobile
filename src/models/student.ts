export interface StudentData {
  name: string;
  speciality: string;
  educationForm: string;
  year: string;
  group: string;
  groupShort: string;
  isLyceum: boolean;
}

export interface StudentState {
  info: StudentData;
  messageCount: number | null;
  announceCount: number | null;
  sessionTestID: string;
  currentWeek?: number;
  currentSession?: number;
  hasUnverifiedEmail: boolean;
  iCalToken?: string;
}
