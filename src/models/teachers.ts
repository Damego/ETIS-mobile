import { DisciplineTypes } from './other';

export interface ITeacherSubject {
  discipline: string;
  types: DisciplineTypes[];
}

export interface ITeacher {
  id: string;
  cathedraId: string;
  photo: string;
  photoTitle: string;
  name: string;
  cathedra: string;
  subjects: ITeacherSubject[];
}
