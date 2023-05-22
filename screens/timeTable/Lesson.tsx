import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ILesson } from '../../parser/timeTable';

const styles = StyleSheet.create({
  lessonContainer: {
    flexDirection: 'row',
    marginBottom: '1%',
  },
  lessonTimeView: {
    paddingRight: '2%',
    paddingVertical: 2,
    alignItems: 'center',
  },
  lessonPairText: {
    fontSize: 13,
  },
  lessonInfoView: {
    flex: 1
  },
  lessonInfoText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

interface ILessonProps {
  data: ILesson
}

const Lesson = ({ data }: ILessonProps) => {
  const { audience, subject, time, lessonPosition } = data;
  const lessonNum = `${lessonPosition} пара`

  return (
    <View style={styles.lessonContainer}>
      <View style={styles.lessonTimeView}>
        <Text style={styles.lessonPairText}>{lessonNum}</Text>
        <Text>{time}</Text>
      </View>
      <View style={styles.lessonInfoView}>
        <Text style={styles.lessonInfoText}>{subject}</Text>
        <Text>{audience}</Text>
      </View>
    </View>
  );
};

export default Lesson;
