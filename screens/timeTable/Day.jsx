import React from 'react';
import { Text, View } from 'react-native';

import CardHeaderOut from '../../components/CardHeaderOut';
import Lesson from './Lesson';

const EmptyDay = ({ data }) => {
  const { date } = data;

  return (
    <CardHeaderOut topText={date}>
      <View style={{alignItems: 'center'}}>
        <Text style={{fontSize: 16, fontWeight: '600'}}>Пар нет</Text>
      </View>
    </CardHeaderOut>
  );
};

const Day = ({ data }) => {
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
