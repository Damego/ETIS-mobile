import { LessonTypes } from './other';

export interface ITeacherSubject {
  discipline: string;
  types: LessonTypes[];
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
