import dayjs from 'dayjs';
import React, { useContext, useRef, useState } from 'react';
import { View } from 'react-native';
import BorderLine from '~/components/BorderLine';
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
    .map((day, index) => {
      const date = bumpDate();
      if (!localShowPastWeekDays && currentDate > date && currentDate <= weekEndDate) return null;
      return (
        <React.Fragment key={day.date}>
          <Day data={day} date={date} />
          {index !== data.length - 1 && <BorderLine />}
        </React.Fragment>
      );
    })
    .filter((comp) => comp !== null);

  if (components.length === 0 && currentDate.weekday() === 6) {
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
    <View style={{ gap: 8 }}>
      {components.length < 6 && (
        <Button
          text={'Показать прошедшие дни'}
          onPress={showPastDays}
          variant={'card'}
          fontStyle={fontSize.medium}
        />
      )}
      {components}
    </View>
  );
};

export default React.memo(DayArray);
