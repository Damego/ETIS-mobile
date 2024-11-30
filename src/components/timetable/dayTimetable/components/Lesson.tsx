import { AntDesign, Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { useNavigation, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import DisciplineType from '~/components/DisciplineType';
import TaskBadge from '~/components/TaskBadge';
import Text from '~/components/Text';
import { useTimetableContext } from '~/context/timetableContext';
import { useAppTheme } from '~/hooks/theme';
import { ILesson } from '~/models/timeTable';
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
  const navigation = useNavigation();
  const theme = useAppTheme();

  const { teachers } = useTimetableContext();
  const audience = formatAudience(lesson);
  const teacherName = lesson.teacher ? getTeacherName(teachers, lesson.teacher) : null;

  const onLessonPress = () => {
    navigation.navigate('(disciplineInfo)', {
      lesson: JSON.stringify(lesson),
      date: date.toISOString(),
      pairPosition,
    });
  };

  return (
    <TouchableOpacity style={styles.lessonContainer} onPress={onLessonPress}>
      <Text style={styles.lessonNameText}>
        {lesson.subject.discipline ?? lesson.subject.string}
      </Text>
      <View style={styles.row}>
        {lesson.subject.type && <DisciplineType type={lesson.subject.type} size={'small'} />}
        <TaskBadge subject={lesson.subject} date={date} />
      </View>

      {audience && (
        <View style={styles.row}>
          <Ionicons name={'business-outline'} size={20} color={theme.colors.text} />
          <Text>{audience}</Text>
        </View>
      )}
      {lesson.announceHTML && (
        <View style={styles.row}>
          <AntDesign name="warning" size={20} color={theme.colors.text} />
          <Text>Объявление</Text>
        </View>
      )}

      {(!!teacherName || !!lesson.shortGroups?.length) && (
        <View style={styles.row}>
          <Ionicons name={'school-outline'} size={20} color={theme.colors.text} />
          {!!teacherName && <Text>{teacherName}</Text>}
          {!!lesson.shortGroups?.length && <Text>{formatGroups(lesson.shortGroups)}</Text>}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default React.memo(Lesson);

const styles = StyleSheet.create({
  lessonContainer: {
    gap: 4,
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
