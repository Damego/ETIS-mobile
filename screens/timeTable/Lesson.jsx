import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  lessonContainer: {
    display: 'flex',
    marginTop: '1%',
    marginBottom: '1%',
    flexWrap: 'nowrap',
    flexShrink: 1,
    flexDirection: 'row',
  },
  lessonTimeView: {
    paddingHorizontal: 1,
    paddingVertical: 2,
    width: '15%',
    alignItems: 'center',
  },
  lessonTimeText: {
    fontSize: 14,
  },
  lessonPairText: {
    fontSize: 13,
  },
  lessonInfoView: {
    width: '85%',
  },
  lessonInfoText: {
    fontSize: 16,
    fontWeight: '500',
  },
  lessonAudienceText: {
    color: '#353535',
  },
});

const Lesson = ({ data }) => {
  const { audience, subject, time, lessonPosition } = data;
  const lessonNum = `${lessonPosition} пара`

  return (
    <View style={styles.lessonContainer}>
      <View style={styles.lessonTimeView}>
        <Text style={styles.lessonPairText}>{lessonNum}</Text>
        <Text style={styles.lessonTimeText}>{time}</Text>
      </View>
      <View style={styles.lessonInfoView}>
        <Text style={styles.lessonInfoText}>{subject}</Text>
        <Text style={styles.lessonAudienceText}>{audience}</Text>
      </View>
    </View>
  );
};

export default Lesson;
