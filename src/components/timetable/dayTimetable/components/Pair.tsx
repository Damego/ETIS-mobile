import dayjs from 'dayjs';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import BorderLine from '~/components/BorderLine';
import Text from '~/components/Text';
import { useTimetableContext } from '~/context/timetableContext';
import { useAppSelector, useGlobalStyles } from '~/hooks';
import { IPair } from '~/models/timeTable';

import Lesson from './Lesson';

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

      <View style={styles.lessonsContainer}>
        {pair.lessons.map((lesson, index) => {
          return (
            <React.Fragment key={index}>
              <Lesson lesson={lesson} pairPosition={pair.position} date={pairDate} />
              {index !== pair.lessons.length - 1 && <BorderLine />}
            </React.Fragment>
          );
        })}
        {pair.event && (
          <View>
            <Text style={styles.eventTitleText}>Мероприятие "{pair.event.name}"</Text>
            <Text style={styles.eventNameText}>{pair.event.contact_info}</Text>
            <Text style={styles.eventNameText}>{pair.event.department}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default React.memo(Pair);

const styles = StyleSheet.create({
  pairContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  lessonsContainer: {
    flexDirection: 'column',
    flex: 1,
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
  eventTitleText: {
    fontSize: 16,
    fontWeight: '500',
  },
  eventNameText: {
    fontSize: 16,
  },
});
