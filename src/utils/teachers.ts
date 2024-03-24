import { ITeacher } from '../models/teachers';
import { ITeacher as ITimeTableTeacher } from '../models/timeTable';

export const getTeacherName = (teachers: ITeacher[], teacher: ITimeTableTeacher) => {
  let teacherName: string;

  if (teacher.id) {
    const $teacher = teachers.find(($teacher) => $teacher.id === teacher.id);
    if ($teacher) teacherName = $teacher.name;
  }
  if (!teacherName) teacherName = teacher.name;

  return teacherName;
};
