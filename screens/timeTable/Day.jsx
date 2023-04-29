import React from 'react';
import { Text, View } from 'react-native';

import Lesson from './Lesson';
import Card from '../../components/Card';
import { GLOBAL_STYLES } from '../../styles/styles';

const EmptyDay = ({ data }) => {
  const { date } = data;

  return (
    <Card
      topText={date}
      component={
        // TODO: Rename these styles
        <View style={[GLOBAL_STYLES.lessonContainer, {paddingLeft: '1%'}]}>
          <View style={GLOBAL_STYLES.lessonInfoView}>
            <Text style={GLOBAL_STYLES.lessonInfoText}>{'\nПар нет!\n'}</Text>
          </View>
        </View>
      }
    />
  );
};

const Day = ({ data }) => {
  const { date, lessons } = data;

  return (
    <Card
      topText={date}
      component={lessons.map((lesson, index) => {
        lesson.pair = `${index + 1} пара`;
        return (
        <Lesson key={date + lesson.time + lesson.subject} data={lesson} />
        )
      })}
    />
  );
};

export { Day, EmptyDay };
