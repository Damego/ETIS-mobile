import { ButtonMenuOption } from '../../components/ModalMenu';
import { ITeacherTimetable } from '../../models/cathedraTimetable';

export const DAYS = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];

export const generateOptionsFromTeachers = (
  teacherTimetable: ITeacherTimetable[],
  currentTeacherName: string
): ButtonMenuOption[] =>
  teacherTimetable.map((timetable) => ({
    name: timetable.teacherName,
    value: timetable.teacherName,
    isCurrent: timetable.teacherName === currentTeacherName,
  }));
