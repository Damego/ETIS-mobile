import moment from 'moment';
import React from 'react';
import { Text, View } from 'react-native';

import BorderLine from '../../components/BorderLine';
import CardHeaderOut from '../../components/CardHeaderOut';
import { useAppSelector, useGlobalStyles } from '../../hooks';
import { TeacherType } from '../../models/teachers';
import { ITimeTableDay } from '../../models/timeTable';
import { ThemeType } from '../../styles/themes';
import { halloweenEmptyDayResponses } from '../../utils/events';
import { fontSize } from '../../utils/texts';
import { getRandomItem } from '../../utils/utils';
import Pair from './Pair';

interface DayData {
  data: ITimeTableDay;
  teachersData: TeacherType;
  date: moment.Moment;
}

const responses = ['Пар нет', 'Отдых', '💤', '😴', '🎮', '(๑ᵕ⌓ᵕ̤)'];

const getRandomResponse = (hasHalloweenTheme: boolean) => {
  if (hasHalloweenTheme) return getRandomItem(halloweenEmptyDayResponses);
  return getRandomItem(responses);
};

const EmptyDay = ({ data }: { data: ITimeTableDay }) => {
  const { date } = data;
  const globalStyles = useGlobalStyles();
  const { theme } = useAppSelector((state) => state.settings);

  return (
    <CardHeaderOut topText={date}>
      <View style={{ alignItems: 'center' }}>
        <Text style={{ ...fontSize.medium, fontWeight: '600', ...globalStyles.textColor }}>
          {getRandomResponse(theme === ThemeType.halloween)}
        </Text>
      </View>
    </CardHeaderOut>
  );
};

const Day = ({ data, teachersData, date }: DayData) => {
  const { date: dateString, pairs } = data;

  return (
    <CardHeaderOut topText={dateString}>
      {pairs.map((pair, index) => (
        <View key={index + pair.time}>
          <Pair pair={pair} teachersData={teachersData} date={date} />
          {index !== pairs.length - 1 && <BorderLine />}
        </View>
      ))}
    </CardHeaderOut>
  );
};

export { Day, EmptyDay };
