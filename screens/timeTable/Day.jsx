import React from 'react';
import { Text, View } from 'react-native';

import CardHeaderOut from '../../components/CardHeaderOut';
import Lesson from './Lesson';

const EmptyDay = ({ data }) => {
  const { date } = data;

  return (
    <CardHeaderOut topText={date}>
      <Text>Пар нет</Text>
    </CardHeaderOut>
  );
};

const Day = ({ data }) => {
  const { date, lessons } = data;

  return (
    <CardHeaderOut topText={date}>
      {lessons.map((lesson, index) => {
        return <Lesson key={date + lesson.time + lesson.subject} data={lesson} />;
      })}
    </CardHeaderOut>
  );
};

export { Day, EmptyDay };
