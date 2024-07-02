import dayjs from 'dayjs';
import React, { useContext, useRef, useState } from 'react';
import { View } from 'react-native';
import { Button } from '~/components/Button';
import Text from '~/components/Text';
import TimeTableContext from '~/context/timetableContext';
import { useAppSelector } from '~/hooks';
import { ITimeTableDay, WeekDates } from '~/models/timeTable';
import { fontSize } from '~/utils/texts';

import { Day } from './Day';

interface IDayArrayProps {
  data: ITimeTableDay[];
  weekDates: WeekDates;
}

const DayArray = ({ data, weekDates }: IDayArrayProps) => {
  const { showPastWeekDays } = useAppSelector((state) => state.settings.config.ui);
  const [localShowPastWeekDays, setShowPastWeekDays] = useState(showPastWeekDays);

  const { currentDate } = useContext(TimeTableContext);

  let date = dayjs(weekDates.start, 'DD.MM.YYYY');
  const weekEndDate = dayjs(weekDates.end, 'DD.MM.YYYY');

  const showPastDays = () => setShowPastWeekDays(true);

  const bumpDate = () => {
    const prev = date.clone();
    date = date.add(1, 'days');
    return prev;
  };

  const components = data
    .map((day) => {
      const date = bumpDate();
      if (!localShowPastWeekDays && currentDate > date && currentDate <= weekEndDate) return null;
      return <Day key={day.date} data={day} date={date} />;
    })
    .filter((comp) => comp !== null);

  if (components.length === 0) {
    return (
      <>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={[fontSize.large, { fontWeight: '500', textAlign: 'center' }]}>
            Неделя подошла к концу. {'\n'}Приятных выходных! :)
          </Text>
          <Button
            text={'Показать прошедшие дни'}
            onPress={showPastDays}
            variant={'card'}
            fontStyle={fontSize.medium}
          />
        </View>
      </>
    );
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
