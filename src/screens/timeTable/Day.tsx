import moment from 'moment';
import React from 'react';
import { View } from 'react-native';

import BorderLine from '../../components/BorderLine';
import CardHeaderOut from '../../components/CardHeaderOut';
import Text from '../../components/Text';
import { useAppSelector } from '../../hooks';
import { TeacherType } from '../../models/teachers';
import { ITimeTableDay } from '../../models/timeTable';
import { ThemeType, isNewYearTheme } from '../../styles/themes';
import { halloweenEmptyDayResponses, newYearEmptyDayResponse } from '../../utils/events';
import { fontSize } from '../../utils/texts';
import { getRandomItem } from '../../utils/utils';
import Pair from './Pair';

interface DayData {
  data: ITimeTableDay;
  teachersData: TeacherType;
  date: moment.Moment;
}

const responses = ['Пар нет', 'Отдых', '💤', '😴', '🎮', '(๑ᵕ⌓ᵕ̤)'];

const getRandomResponse = (appTheme: ThemeType) => {
  if (appTheme === ThemeType.halloween) return getRandomItem(halloweenEmptyDayResponses);
  if (isNewYearTheme(appTheme)) return getRandomItem(newYearEmptyDayResponse);
  return getRandomItem(responses);
};

const EmptyDay = ({ data }: { data: ITimeTableDay }) => {
  const { date } = data;
  const { theme } = useAppSelector((state) => state.settings);

  return (
    <CardHeaderOut topText={date}>
      <View style={{ alignItems: 'center' }}>
        <Text style={{ ...fontSize.medium, fontWeight: '600' }} colorVariant={'block'}>
          {getRandomResponse(theme)}
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
