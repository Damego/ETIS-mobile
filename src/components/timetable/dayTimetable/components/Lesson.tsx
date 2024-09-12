import { AntDesign, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import DisciplineType from '~/components/DisciplineType';
import TaskBadge from '~/components/TaskBadge';
import Text from '~/components/Text';
import { useTimetableContext } from '~/context/timetableContext';
import { ILesson } from '~/models/timeTable';
import { EducationNavigationProp } from '~/navigation/types';
import { getTeacherName } from '~/utils/teachers';
import { formatAudience, formatGroups } from '~/utils/texts';

const Lesson = ({
  lesson,
  date,
  pairPosition,
}: {
  lesson: ILesson;
  date: dayjs.Dayjs;
  pairPosition: number;
}) => {
  const navigation = useNavigation<EducationNavigationProp>();

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

      {audience && (
        <View style={styles.row}>
          <Ionicons name={'business-outline'} size={20} />
          <Text>{audience}</Text>
        </View>
      )}
      {lesson.announceHTML && (
        <View style={styles.row}>
          <AntDesign name="warning" size={20} />
          <Text>Объявление</Text>
        </View>
      )}
      <View style={styles.row}>
        <Ionicons name={'school-outline'} size={20} />
        {!!teacherName && <Text>{teacherName}</Text>}
        {!!lesson.shortGroups && <Text>{formatGroups(lesson.shortGroups)}</Text>}
      </View>
      <TaskBadge subject={lesson.subject} date={date} />
    </TouchableOpacity>
  );
};

export default React.memo(Lesson);

const styles = StyleSheet.create({
  lessonContainer: {
    gap: 4,
    flex: 1,
  },
  lessonNameText: {
    fontSize: 16,
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});
