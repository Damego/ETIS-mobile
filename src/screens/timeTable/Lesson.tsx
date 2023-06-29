import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useGlobalStyles } from '../../hooks';
import { ILesson } from '../../models/timeTable';
import { fontSize } from '../../utils/texts';

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
  lessonInfoView: {
    flex: 1,
  },
  lessonInfoText: {
    fontWeight: '500',
  },
});

interface ILessonProps {
  data: ILesson;
}

const Lesson = ({ data }: ILessonProps) => {
  const globalStyles = useGlobalStyles();

  const { audience, subject, time, lessonPosition } = data;
  const lessonNum = `${lessonPosition} пара`;

  return (
    <View style={styles.lessonContainer}>
      <View style={styles.lessonTimeView}>
        <Text style={[fontSize.mini, globalStyles.textColor]}>{lessonNum}</Text>
        <Text style={globalStyles.textColor}>{time}</Text>
      </View>
      <View style={styles.lessonInfoView}>
        <Text style={[fontSize.medium, styles.lessonInfoText, globalStyles.textColor]}>
          {subject}
        </Text>
        <Text style={globalStyles.textColor}>{audience}</Text>
      </View>
    </View>
  );
};

export default Lesson;
