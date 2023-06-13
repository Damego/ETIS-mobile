export interface StudentData {
  name: string;
  speciality: string;
  educationForm: string;
  year: string;
  group: string;
}

export interface StudentState {
  info: StudentData;
  messageCount: number | null;
  announceCount: number | null;
}