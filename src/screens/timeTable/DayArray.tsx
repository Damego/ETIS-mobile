import dayjs from 'dayjs';
import React, { useRef, useState } from 'react';

import { Button } from '../../components/Button';
import CenteredText from '../../components/CenteredText';
import { useAppSelector } from '../../hooks';
import { ITimeTableDay, WeekDates } from '../../models/timeTable';
import { fontSize } from '../../utils/texts';
import { Day, EmptyDay } from './Day';

interface IDayArrayProps {
  data: ITimeTableDay[];
  weekDates: WeekDates;
}

const DayArray = ({ data, weekDates }: IDayArrayProps) => {
  const { showPastWeekDays } = useAppSelector((state) => state.settings.config.ui);
  const [localShowPastWeekDays, setShowPastWeekDays] = useState(showPastWeekDays);

  const date = useRef(dayjs(weekDates.start, 'DD.MM.YYYY'));
  const weekEndDate = useRef(dayjs(weekDates.end, 'DD.MM.YYYY'));
  const currentDate = useRef(dayjs().startOf('day'));

  const showPastDays = () => setShowPastWeekDays(true);

  const bumpDate = () => {
    const prev = date.current.clone();
    date.current = date.current.add(1, 'days');
    return prev;
  };

  const components = data
    .map((day) => {
      const date = bumpDate();
      if (
        !localShowPastWeekDays &&
        currentDate.current > date &&
        currentDate.current < weekEndDate.current
      )
        return null;
      return day.pairs.length === 0 ? (
        <EmptyDay key={day.date} data={day} />
      ) : (
        <Day key={day.date} data={day} date={date} />
      );
    })
    .filter((comp) => comp !== null);

  if (components.length === 0) {
    // todo: btn to show tt
    return <CenteredText>Неделя подошла к концу. Приятных выходных! :)</CenteredText>;
  }

  return (
    <>
      {components.length !== 6 && (
        <Button
          text={'Показать прошедшие дни'}
          onPress={showPastDays}
          variant={'card'}
          fontStyle={fontSize.medium}
        />
      )}
      {components}
    </>
  );
};

export default DayArray;
