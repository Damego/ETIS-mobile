import { ButtonMenuOption } from '~/components/ButtonMenu';
import { ITimeTable } from '~/models/timeTable';

export const generateOptionsFromTeachers = (
  teacherTimetable: ITimeTable[],
  teacherId: string
): ButtonMenuOption[] =>
  teacherTimetable.map((timetable) => ({
    name: timetable.teacher.name,
    value: timetable.teacher,
    isCurrent: timetable.teacher.id === teacherId,
  }));
