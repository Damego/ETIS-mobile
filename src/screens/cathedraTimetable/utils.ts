import { ITeacherTimetable } from '../../models/cathedraTimetable';

export const DAYS = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];

export const generateOptionsFromTeachers = (
  teacherTimetable: ITeacherTimetable[],
  currentTeacherName: string
) =>
  teacherTimetable.map((timetable) => ({
    label: timetable.teacherName,
    value: timetable.teacherName,
    current: timetable.teacherName === currentTeacherName,
  }));
