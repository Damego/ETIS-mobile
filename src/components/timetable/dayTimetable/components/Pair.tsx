import dayjs from 'dayjs';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Text from '~/components/Text';
import Lesson from './Lesson';
import { useTimetableContext } from '~/context/timetableContext';
import { useAppSelector, useGlobalStyles } from '~/hooks';
import { IPair } from '~/models/timeTable';

const Pair = ({ pair }: { pair: IPair }) => {
  const globalStyles = useGlobalStyles();
  const { selectedDate: dayDate } = useTimetableContext();
  const time = dayjs(pair.time, 'H:mm');
  const pairDate = dayDate.clone().set('hour', time.hour()).set('minute', time.minute());
  const isLyceum = useAppSelector((state) => state.student.info?.isLyceum);
  const pairText = `${pair.position} ${isLyceum ? 'урок' : 'пара'}`;

  return (
    <View style={styles.pairContainer}>
      <View style={styles.timeContainer}>
        <View
          style={{
            backgroundColor: '#fbf0f1',
            paddingVertical: 2,
            paddingHorizontal: 4,
            borderRadius: 4,
          }}
        >
          <Text style={[globalStyles.primaryText, { fontWeight: '500' }]}>{pairText}</Text>
        </View>
        <Text style={styles.timeStartText}>{pair.time}</Text>
        <Text style={styles.timeEndText}>
          {time.clone().add(1, 'hour').add(35, 'minute').format('H:mm')}
        </Text>
      </View>

      {pair.lessons.map((lesson, index) => {
        return (
          <Lesson
            lesson={lesson}
            pairPosition={pair.position}
            date={pairDate}
            key={index.toString()}
          />
        );
      })}
    </View>
  );
};

export default React.memo(Pair);

const styles = StyleSheet.create({
  pairContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  lessonContainer: {
    gap: 4,
    flex: 1,
  },
  lessonNameText: {
    fontSize: 16,
    fontWeight: '500',
  },
  timeContainer: {
    alignItems: 'center',
  },
  timeStartText: {
    fontSize: 18,
    fontWeight: '500',
  },
  timeEndText: {
    fontSize: 16,
    color: '#808080',
  },
});
