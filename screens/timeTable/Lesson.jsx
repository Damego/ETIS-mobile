import React from 'react';
import { View, Text } from 'react-native';

import { GLOBAL_STYLES } from '../../styles/styles';

const Lesson = (data) => {
  const { lesson } = data;

  return (
    <View style={GLOBAL_STYLES.lessonContainer}>
      <View style={GLOBAL_STYLES.lessonTimeView}>
        <Text style={GLOBAL_STYLES.lessonTimeText}>{lesson.time}</Text>
      </View>
      <View style={GLOBAL_STYLES.lessonInfoView}>
        <Text style={GLOBAL_STYLES.lessonInfoText}>{lesson.subject}</Text>
        <Text style={GLOBAL_STYLES.lessonAudienceText}>{lesson.audience}</Text>
      </View>
    </View>
  );
};

export default Lesson;
