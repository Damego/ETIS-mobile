import moment from 'moment/moment';

export const getCurrentEducationYear = () => {
  const date = moment();
  const year = date.year();

  // До сентября - старый учебный год
  if (date.month() < 9) return year - 1;

  // После сентября - новый
  return year;
};
