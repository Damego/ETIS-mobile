import moment from 'moment';
import React from 'react';

import { TeacherType } from '../../models/teachers';
import { ITimeTableDay, WeekDates } from '../../models/timeTable';
import { Day, EmptyDay } from './Day';

interface IDayArrayProps {
  data: ITimeTableDay[];
  teachersData: TeacherType;
  weekDates: WeekDates;
}

const DayArray = ({ data, teachersData, weekDates }: IDayArrayProps) => {
  let date = moment(weekDates.start, 'DD.MM.YYYY');

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
          <Day key={day.date} data={day} teachersData={teachersData} date={date} />
        );
      })}
    </>
  );
};

export default DayArray;
