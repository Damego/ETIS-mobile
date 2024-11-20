import { AntDesign } from '@expo/vector-icons';
import dayjs from 'dayjs';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useAppTheme } from '~/hooks/theme';
import useTasks from '~/hooks/useTasks';
import { ISubject } from '~/models/timeTable';

const TaskBadge = ({ subject, date }: { subject: ISubject; date: dayjs.Dayjs }) => {
  const theme = useAppTheme();
  const { tasks } = useTasks({
    filter: (task) =>
      task.disciplineName === subject.discipline &&
      !task.isComplete &&
      task.datetime &&
      task.datetime.toISOString() === date.toISOString(),
  });

  if (!tasks.length) return;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.primary }]}>
      <AntDesign name="checkcircleo" size={15} color={theme.colors.primaryContrast} />
    </View>
  );
};

export default TaskBadge;

const styles = StyleSheet.create({
  container: {
    borderRadius: 5,
    paddingHorizontal: '1%',
    paddingVertical: '1%',
    alignSelf: 'flex-start',
  },
});
