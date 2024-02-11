import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import moment from 'moment';
import 'moment/locale/ru';

type DateType = moment.Moment | dayjs.Dayjs;

export const compareTime = (a: DateType, b: DateType): number => {
  if (a > b) return 1;
  if (a < b) return -1;
  return 0;
};

interface IFormatTimeProps {
  disableTime: boolean;
  disableDate: boolean;
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
  const date = moment();
  const year = date.year();

  // До сентября - старый учебный год
  if (date.month() < 8) return year - 1;

  // После сентября - новый
  return year;
};
