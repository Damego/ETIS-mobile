import { useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';
import React, { useContext } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import DisciplineType from '~/components/DisciplineType';
import TaskBadge from '~/components/TaskBadge';
import Text from '~/components/Text';
import TimeTableContext from '~/context/timetableContext';
import { useAppSelector } from '~/hooks';
import useAppRouter from '~/hooks/useAppRouter';
import { ILesson, IPair } from '~/models/timeTable';
import { EducationNavigationProp } from '~/navigation/types';
import { getTeacherName } from '~/utils/teachers';
import { fontSize, formatAudience } from '~/utils/texts';

const Pair = ({ pair, date }: { pair: IPair; date: dayjs.Dayjs }) => {
  const isLyceum = useAppSelector((state) => state.student.info?.isLyceum);
  const pairText = `${pair.position} ${isLyceum ? 'урок' : 'пара'}`;

  return (
    <View style={styles.pairContainer}>
      <View style={styles.pairTimeContainer}>
        <Text style={fontSize.mini}>{pairText}</Text>
        <Text>{pair.time}</Text>
      </View>

      <View style={{ flexDirection: 'column', flex: 1 }}>
        {pair.lessons.map((lesson, ind) => {
          const time = dayjs(pair.time, 'HH:mm');
          const cloned = date.clone().set('hour', time.hour()).set('minute', time.minute());

          return (
            <Lesson
              key={lesson.subject.string + ind}
              data={lesson}
              date={cloned}
              pairPosition={pair.position}
            />
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

const Lesson = React.memo(
  ({ data, date, pairPosition }: { data: ILesson; date: dayjs.Dayjs; pairPosition: number }) => {
    const router = useAppRouter();
    const { teachers } = useContext(TimeTableContext);

    const audience = formatAudience(data);
    const teacherName = getTeacherName(teachers, data.teacher);

    return (
      <TouchableOpacity
        style={styles.lessonContainer}
        onPress={() =>
          router.push('(shared)/disciplineInfo', {
            payload: { lesson: data, date: date.toISOString(), pairPosition },
          })
        }
      >
        <Text style={[fontSize.medium, styles.lessonInfoText]}>
          {data.subject.discipline ?? data.subject.string}
        </Text>
        <View style={styles.badges}>
          {data.subject.type && <DisciplineType type={data.subject.type} size={'small'} />}
          <TaskBadge subject={data.subject} date={date} />
        </View>

        {data.distancePlatform && <Text>{data.distancePlatform.name}</Text>}
        {!data.distancePlatform && audience && <Text>{audience}</Text>}
        {data.announceHTML && <Text>Объявление</Text>}

        {teacherName && <Text>{teacherName}</Text>}
      </TouchableOpacity>
    );
  }
);

export default React.memo(Pair);

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
  lessonContainer: {},
  lessonInfoText: {
    fontWeight: '500',
  },
  badges: {
    gap: 4,
    flexDirection: 'row',
  },
  eventTitleText: {
    ...fontSize.medium,
    fontWeight: '500',
  },
  eventNameText: {},
});
