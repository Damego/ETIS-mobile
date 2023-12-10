import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Popover, { PopoverPlacement } from 'react-native-popover-view';

import BorderLine from '../../components/BorderLine';
import Text from '../../components/Text';
import { useGlobalStyles } from '../../hooks';
import { useAppTheme } from '../../hooks/theme';
import { ILesson, IPair } from '../../models/cathedraTimetable';
import { fontSize } from '../../utils/texts';

const styles = StyleSheet.create({
  pairContainer: {
    flexDirection: 'row',
    marginBottom: '1%',
  },
  pairTimeContainer: {
    marginVertical: 2,
    marginRight: '2%',
    alignItems: 'center',
  },
  noPairsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lessonContainer: {
    justifyContent: 'center',
    flex: 1,
  },
  lessonInfoText: {
    fontWeight: '500',
    ...fontSize.medium,
  },
});

const Pair = ({ pair, index }: { pair: IPair; index: number }) => {
  const pairText = `${index + 1} пара`;

  return (
    <View style={styles.pairContainer}>
      <View style={styles.pairTimeContainer}>
        <Text style={fontSize.mini} colorVariant={'block'}>{pairText}</Text>
        <Text colorVariant={'block'}>{pair.time}</Text>
      </View>

      <View style={styles.lessonContainer}>
        {pair.lessons.map((lesson, lessonIndex) => (
          <LessonWithPopover lesson={lesson} key={lesson.discipline + lessonIndex} />
        ))}
      </View>
    </View>
  );
};

const LessonWithPopover = ({ lesson }: { lesson: ILesson }) => {
  const globalStyles = useGlobalStyles();

  return (
    <Popover
      placement={PopoverPlacement.FLOATING}
      from={(_, showPopover) => (
        <TouchableOpacity onPress={showPopover}>
          <Text style={styles.lessonInfoText} colorVariant={'block'} key={lesson.discipline}>
            {lesson.discipline}
          </Text>
        </TouchableOpacity>
      )}
      popoverStyle={{
        borderRadius: globalStyles.border.borderRadius,
        padding: '2%',
        backgroundColor: globalStyles.block.backgroundColor,
      }}
    >
      <Text style={styles.lessonInfoText} colorVariant={'block'}>
        Аудитория (по неделям):
      </Text>
      <Text style={fontSize.medium} colorVariant={'block'}>{lesson.audience.standard}</Text>
      <Text style={styles.lessonInfoText} colorVariant={'block'}>Группы:</Text>
      <Text style={fontSize.medium} colorVariant={'block'}>{lesson.groups.join('\n')}</Text>
    </Popover>
  );
};

const Pairs = ({ pairs }: { pairs: IPair[] }) => {
  if (!pairs.length) {
    return (
      <View style={styles.noPairsContainer}>
        <Text style={styles.lessonInfoText} colorVariant={'block'}>Пар нет</Text>
      </View>
    );
  }
  return pairs.map((pair, index) => (
    <View key={pair.time}>
      <Pair pair={pair} index={index} />
      {index !== pairs.length - 1 && <BorderLine />}
    </View>
  ));
};

export default Pairs;
