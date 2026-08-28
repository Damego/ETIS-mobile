import 'dayjs/locale/ru';

import dayjs from 'dayjs';

type DateType = dayjs.Dayjs;

export const compareTime = (a: DateType, b: DateType): number => {
  if (a > b) return 1;
  if (a < b) return -1;
  return 0;
};

interface IFormatTimeProps {
  disableTime?: boolean;
  disableDate?: boolean;
}

const dateFormat = 'D MMMM';
const timeFormat = 'HH:mm';
export const formatTime = (
  date: DateType,
  { disableTime, disableDate }: IFormatTimeProps = { disableTime: false, disableDate: false }
) => {
  if (disableTime && disableDate) return '';
  date = date.locale('ru');

  if (disableTime) {
    return date.format(dateFormat);
  }
  if (disableDate) {
    return date.format(timeFormat);
  }
  return date.format(`${dateFormat} в ${timeFormat}`);
};

export const getCurrentEducationYear = (date: dayjs.Dayjs = dayjs()) => {
  const year = date.year();
  const newYearStart = dayjs(new Date(year, 8, 1));

  // С 1 сентября (включительно) - новый учебный год
  if (!date.isBefore(newYearStart, 'day')) return year;

  // До 1 сентября. Учебный год обычно начинается в последнюю неделю августа
  // (неделя, предшествующая первой учебной неделе сентября). Если дата попадает
  // в эту "переходную" неделю августа, она уже относится к новому учебному году.
  const academicStart = newYearStart.startOf('isoWeek');
  if (date.month() === 7 && !date.isBefore(academicStart.subtract(1, 'week'), 'day')) {
    return year;
  }

  return year - 1;
};

export const getStudentYear = (entryYear: number) => getCurrentEducationYear() - entryYear + 1;

export const getEducationWeekByDate = (date: dayjs.Dayjs) => {
  const firstWeekDate = dayjs(new Date(getCurrentEducationYear(date), 8, 1)).startOf('isoWeek');
  return Math.max(1, date.startOf('isoWeek').diff(firstWeekDate, 'week') + 1);
};

export const getFirstEducationWeekDate = () => {
  const year = getCurrentEducationYear();
  return dayjs(new Date(year, 8, 1)).startOf('isoWeek');
};

export const getLastEducationWeekDate = () => {
  const year = getCurrentEducationYear() + 1;
  return dayjs(new Date(year, 8, 1)).startOf('isoWeek').subtract(1, 'day');
};
