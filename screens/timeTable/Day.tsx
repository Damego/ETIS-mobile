import React from 'react';
import { Text, View } from 'react-native';

import CardHeaderOut from '../../components/CardHeaderOut';
import Lesson from './Lesson';

import {TimeTableDay} from '../../parser/timeTable';

interface DayData {
  data: TimeTableDay;
}

const EmptyDay = ({ data }: DayData) => {
  const { date } = data;

  return (
    <CardHeaderOut topText={date}>
      <View style={{alignItems: 'center'}}>
        <Text style={{fontSize: 16, fontWeight: '600'}}>Пар нет</Text>
      </View>
    </CardHeaderOut>
  );
};

const Day = ({ data }: DayData) => {
  const { date, lessons } = data;

  return (
    <CardHeaderOut topText={date}>
      {lessons.map((lesson) => (
        <Lesson key={date + lesson.time + lesson.subject} data={lesson} />
      ))}
    </CardHeaderOut>
  );
};

export { Day, EmptyDay };
