import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useGlobalStyles } from '../../hooks';
import { ILesson, IPair } from '../../models/timeTable';
import { fontSize } from '../../utils/texts';

export default function Pair({ pair }: { pair: IPair }) {
  const globalStyles = useGlobalStyles();
  const pairText = `${pair.position} пара`;

  return (
    <View style={styles.pairContainer}>
      <View style={styles.pairTimeContainer}>
        <Text style={[fontSize.mini, globalStyles.textColor]}>{pairText}</Text>
        <Text style={globalStyles.textColor}>{pair.time}</Text>
      </View>

      <View style={{ flexDirection: 'column' }}>
        {pair.lessons.map((lesson, ind) => (
          <Lesson data={lesson} key={lesson.subject + ind} />
        ))}
      </View>
    </View>
  );
}

const Lesson = ({ data }: { data: ILesson }) => {
  const globalStyles = useGlobalStyles();
  const { audience, subject } = data;

  return (
    <View style={styles.lessonContainer}>
      <Text style={[fontSize.medium, styles.lessonInfoText, globalStyles.textColor]}>
        {subject}
      </Text>
      <Text style={globalStyles.textColor}>{audience}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  pairContainer: {
    flexDirection: 'row',
    marginBottom: '1%',
  },
  pairTimeContainer: {
    paddingRight: '2%',
    paddingVertical: 2,
    alignItems: 'center',
  },
  lessonContainer: {
    flex: 1,
  },
  lessonInfoText: {
    fontWeight: '500',
  },
});
