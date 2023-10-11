import React from 'react';

import { TeacherType } from '../../models/teachers';
import { ITimeTableDay } from '../../models/timeTable';
import { Day, EmptyDay } from './Day';
import { TeacherType } from '../../models/teachers';

interface IDayArrayProps {
  data: ITimeTableDay[];
  teachersData: TeacherType;
}

const DayArray = ({ data, teachersData }: IDayArrayProps) => (
  <>
    {data.map((day) =>
      day.pairs.length === 0 ? (
        <EmptyDay key={day.date} data={day} teachersData={teachersData} />
      ) : (
        <Day key={day.date} data={day} teachersData={teachersData} />
      )
    )}
  </>
);

export default DayArray;
