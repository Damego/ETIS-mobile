import { DisciplineTypes } from './other';

export interface ITeacher {
  id: string;
  cathedraId: string;
  photo: string;
  photoTitle: string;
  name: string;
  cathedra: string;
  subject: {
    discipline: string;
    types: DisciplineTypes[];
  };
}
