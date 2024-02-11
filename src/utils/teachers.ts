import { TeacherType } from '../models/teachers';
import { ITeacher } from '../models/timeTable';

export const getTeacherName = (teacherGroups: TeacherType, teacher: ITeacher) => {
  let teacherName: string;

  if (teacher.id) {
    teacherGroups.forEach(([, teachers]) => {
      const $teacher = teachers.find(($teacher) => $teacher.id === teacher.id);
      if ($teacher) teacherName = $teacher.name;
    });
  }
  if (!teacherName) teacherName = teacher.name;

  return teacherName;
};