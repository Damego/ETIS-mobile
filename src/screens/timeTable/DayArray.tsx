import React from 'react';

import { ITimeTableDay } from '../../models/timeTable';
import { Day, EmptyDay } from './Day';

interface IDayArrayProps {
  data: ITimeTableDay[];
}

const DayArray = ({ data }: IDayArrayProps) => (
  <>
    {data.map((day) =>
      day.pairs.length === 0 ? (
        <EmptyDay key={day.date} data={day} />
      ) : (
        <Day key={day.date} data={day} />
      )
    )}
  </>
);

export default DayArray;
