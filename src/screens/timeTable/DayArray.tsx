import React from 'react';

import { ITimeTableDay } from '../../models/timeTable';
import { Day, EmptyDay } from './Day';
import { TeacherType } from '../../models/teachers';

interface IDayArrayProps {
  data: ITimeTableDay[];
  teachers_data: TeacherType;
}

const DayArray = ({ data, teachers_data }: IDayArrayProps) => (
  <>
    {data.map((day) =>
      day.pairs.length === 0 ? (
        <EmptyDay key={day.date} data={day} teachers_data={teachers_data} />
      ) : (
        <Day key={day.date} data={day} teachers_data={teachers_data} />
      )
    )}
  </>
);

export default DayArray;
