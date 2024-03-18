import dayjs from 'dayjs';
import React from 'react';

import CenteredText from '../../components/CenteredText';
import Text from '../../components/Text';
import { ITimeTableDay, WeekDates } from '../../models/timeTable';
import { Day, EmptyDay } from './Day';

interface IDayArrayProps {
  data: ITimeTableDay[];
  weekDates: WeekDates;
}

const DayArray = ({ data, weekDates }: IDayArrayProps) => {
  let date = dayjs(weekDates.start, 'DD.MM.YYYY');
  const currentDate = dayjs();

  const bumpDate = () => {
    const prev = date.clone();
    date = date.add(1, 'days');
    return prev;
  };

  const components = data
    .map((day) => {
      const date = bumpDate();
      if (currentDate > date) return null;
      return day.pairs.length === 0 ? (
        <EmptyDay key={day.date} data={day} />
      ) : (
        <Day key={day.date} data={day} date={date} />
      );
    })
    .filter((comp) => !!comp);

  if (components.length === 0) {
    return <CenteredText>Неделя подошла к концу. Приятных выходных! :)</CenteredText>;
  }

  return components;
};

export default DayArray;
