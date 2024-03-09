export interface UploadFile {
  name: string;
  type: string;
  uri: string;
}

export enum DisciplineTypes {
  LECTURE = 'LECTURE',
  PRACTICE = 'PRACTICE',
  LABORATORY = 'LABORATORY',
  EXAM = 'EXAM',
  TEST = 'TEST'
}