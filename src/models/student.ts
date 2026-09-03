export interface StudentData {
  name: string | null;
  speciality: string | null;
  educationForm: string | null;
  year: string | null;
  group: string | null;
  groupShort?: string | null;
  isLyceum: boolean;
}

export interface StudentState {
  info: StudentData | null;
  messageCount: number | null;
  announceCount: number | null;
  sessionTestID: string | null;
  currentWeek?: number | null;
  currentSession?: number | null;
  hasUnverifiedEmail: boolean;
}
