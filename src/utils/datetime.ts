import dayjs from 'dayjs';
import 'dayjs/locale/ru';

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
  date = date.locale('ru') as DateType;

  if (disableTime) {
    return date.format(dateFormat);
  }
  if (disableDate) {
    return date.format(timeFormat);
  }
  return date.format(`${dateFormat} в ${timeFormat}`);
};

export const getCurrentEducationYear = () => {
  const date = dayjs();
  const year = date.year();

  // До сентября - старый учебный год
  if (date.month() < 8) return year - 1;

  // После сентября - новый
  return year;
};

export const getStudentYear = (entryYear: number): string => {
  return String(getCurrentEducationYear() - entryYear + 1);
};

export const getEducationWeekByDate = (date: dayjs.Dayjs) => {
  const firstWeekDate = dayjs(new Date(getCurrentEducationYear(), 8, 2)).startOf('isoWeek');
  return date.startOf('isoWeek').diff(firstWeekDate, 'week') + 1;
};


export const getFirstEducationWeekDate = () => {
  const year = getCurrentEducationYear();
  return dayjs().startOf('day').startOf('week').year(year).month(8).day(2);
}

export const getLastEducationWeekDate = () => {
  const year = getCurrentEducationYear() + 1;
  return dayjs().year(year).month(8).date(1).startOf('day');
}