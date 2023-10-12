export interface ITeacher {
  id: string;
  photo: string;
  photoTitle: string;
  name: string;
  cathedra: string;
  subjectUntyped: string;
  subjectType: string;
}

export type TeacherType = [string, ITeacher[]][];
