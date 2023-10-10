export interface ITeacher {
  id: string;
  cathedraId: string;
  photo: string;
  photoTitle: string;
  name: string;
  cathedra: string;
  subjectUntyped: string;
  subjectType: string;
}

export type TeacherType = [string, ITeacher[]][];
