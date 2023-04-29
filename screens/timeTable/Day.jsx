import React from 'react';
import { Text, View } from 'react-native';

import Card from '../../components/Card';
import { GLOBAL_STYLES } from '../../styles/styles';
import Lesson from './Lesson';

const EmptyDay = ({ data }) => {
  const { date } = data;

  return (
    <Card topText={date}>
      {/* TODO: Rename these styles */}
      <View style={[GLOBAL_STYLES.lessonContainer, { paddingLeft: '1%' }]}>
        <View style={GLOBAL_STYLES.lessonInfoView}>
          <Text style={GLOBAL_STYLES.lessonInfoText}>{'\nПар нет!\n'}</Text>
        </View>
      </View>
    </Card>
  );
};

const Day = ({ data }) => {
  const { date, lessons } = data;

  return (
    <Card topText={date}>
      {lessons.map((lesson, index) => {
        lesson.pair = `${index + 1} пара`;
        return <Lesson key={date + lesson.time + lesson.subject} data={lesson} />;
      })}
    </Card>
  );
};

export { Day, EmptyDay };
