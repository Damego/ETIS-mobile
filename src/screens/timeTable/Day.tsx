import React from 'react';
import { Text, View } from 'react-native';

import BorderLine from '../../components/BorderLine';
import CardHeaderOut from '../../components/CardHeaderOut';
import { useGlobalStyles } from '../../hooks';
import { ITimeTableDay } from '../../models/timeTable';
import { fontSize } from '../../utils/texts';
import Lesson from './Lesson';

interface DayData {
  data: ITimeTableDay;
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

const Day = ({ data }: DayData) => {
  const { date, lessons } = data;

  return (
    <CardHeaderOut topText={date}>
      {lessons.map((lesson, index) => (
        <View key={date + lesson.time + lesson.subject}>
          <Lesson data={lesson} />
          {index !== lessons.length - 1 ? <BorderLine /> : <></>}
        </View>
      ))}
    </CardHeaderOut>
  );
};

export { Day, EmptyDay };
