import dayjs from 'dayjs';
import React from 'react';

import { ITimeTableDay, WeekDates } from '../../models/timeTable';
import { Day, EmptyDay } from './Day';

interface IDayArrayProps {
  data: ITimeTableDay[];
  weekDates: WeekDates;
}

const DayArray = ({ data, weekDates }: IDayArrayProps) => {
  let date = dayjs(weekDates.start, 'DD.MM.YYYY');

  const bumpDate = () => {
    const prev = date.clone();
    date = date.add(1, 'days');
    return prev;
  };

  return (
    <>
      {data.map((day) => {
        const date = bumpDate();
        return day.pairs.length === 0 ? (
          <EmptyDay key={day.date} data={day} />
        ) : (
          <Day key={day.date} data={day} date={date} />
        );
      })}
    </>
  );
};

export default DayArray;
