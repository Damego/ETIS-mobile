import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import DisciplineType from '~/components/DisciplineType';
import TaskBadge from '~/components/TaskBadge';
import Text from '~/components/Text';
import { useTimetableContext } from '~/context/timetableContext';
import { useAppSelector, useGlobalStyles } from '~/hooks';
import { ILesson, IPair } from '~/models/timeTable';
import { ETISNavigationProp } from '~/navigation/types';
import { getTeacherName } from '~/utils/teachers';
import { formatAudience } from '~/utils/texts';

const Lesson = ({
  lesson,
  date,
  pairPosition,
}: {
  lesson: ILesson;
  date: dayjs.Dayjs;
  pairPosition: number;
}) => {
  const navigation = useNavigation<ETISNavigationProp>();

  const { teachers } = useTimetableContext();
  const audience = formatAudience(lesson);
  const teacherName = lesson.teacher ? getTeacherName(teachers, lesson.teacher) : null;

  const onLessonPress = () => {
    navigation.navigate('DisciplineInfo', {
      lesson,
      date: date.toISOString(),
      pairPosition,
    });
  };

  return (
    <TouchableOpacity style={styles.lessonContainer} onPress={onLessonPress}>
      <Text style={styles.lessonNameText}>{lesson.subject.discipline}</Text>
      {lesson.subject.type && <DisciplineType type={lesson.subject.type} size={'small'} />}

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
        <Ionicons name={'business-outline'} size={20} />
        <Text>{audience}</Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
        <Ionicons name={'school-outline'} size={20} />
        <Text>{teacherName}</Text>
      </View>
      <TaskBadge subject={lesson.subject} date={date} />
    </TouchableOpacity>
  );
};

const Pair = ({ pair, dayDate }: { pair: IPair; dayDate: dayjs.Dayjs }) => {
  const globalStyles = useGlobalStyles();
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

export default Pair;

const styles = StyleSheet.create({
  pairContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  lessonContainer: {
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    flex: 1,
    padding: '2%',
    gap: 4,
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
