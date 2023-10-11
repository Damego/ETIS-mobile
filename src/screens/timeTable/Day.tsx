import React from 'react';
import { Text, View } from 'react-native';

import BorderLine from '../../components/BorderLine';
import CardHeaderOut from '../../components/CardHeaderOut';
import { useGlobalStyles } from '../../hooks';
import { TeacherType } from '../../models/teachers';
import { ITimeTableDay } from '../../models/timeTable';
import { fontSize } from '../../utils/texts';
import Pair from './Pair';

interface DayData {
  data: ITimeTableDay;
  teachersData: TeacherType;
}

const responses = ['Пар нет', 'Отдых', '💤', '😴', '🎮', '(๑ᵕ⌓ᵕ̤)'];

const getRandomResponse = () => responses[Math.floor(Math.random() * responses.length)];

const EmptyDay = ({ data }: DayData) => {
  const { date } = data;
  const globalStyles = useGlobalStyles();

  return (
    <CardHeaderOut topText={date}>
      <View style={{ alignItems: 'center' }}>
        <Text style={{ ...fontSize.medium, fontWeight: '600', ...globalStyles.textColor }}>
          {getRandomResponse()}
        </Text>
      </View>
    </CardHeaderOut>
  );
};

const Day = ({ data, teachersData }: DayData) => {
  const { date, pairs } = data;

  return (
    <CardHeaderOut topText={date}>
      {pairs.map((pair, index) => (
        <View key={index + pair.time}>
          <Pair pair={pair} teachersData={teachersData} />
          {index !== pairs.length - 1 && <BorderLine />}
        </View>
      ))}
    </CardHeaderOut>
  );
};

export { Day, EmptyDay };
