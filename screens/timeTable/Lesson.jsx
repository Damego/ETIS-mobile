import React from 'react';
import { View, Text } from 'react-native';

import { GLOBAL_STYLES } from '../../styles/styles';

const Lesson = ({ data }) => {
  const { audience, subject, time, pair } = data;

  return (
    <View style={GLOBAL_STYLES.lessonContainer}>
      <View style={GLOBAL_STYLES.lessonTimeView}>
        <Text style={GLOBAL_STYLES.lessonPairText}>{pair}</Text>
        <Text style={GLOBAL_STYLES.lessonTimeText}>{time}</Text>
      </View>
      <View style={GLOBAL_STYLES.lessonInfoView}>
        <Text style={GLOBAL_STYLES.lessonInfoText}>{subject}</Text>
        <Text style={GLOBAL_STYLES.lessonAudienceText}>{audience}</Text>
      </View>
    </View>
  );
};

export default Lesson;
