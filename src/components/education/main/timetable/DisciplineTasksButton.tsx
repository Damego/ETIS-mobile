import { AntDesign } from '@expo/vector-icons';
import dayjs from 'dayjs';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Text from '~/components/Text';
import { useAppTheme } from '~/hooks/theme';
import useAppRouter from '~/hooks/useAppRouter';
import useTasks from '~/hooks/useTasks';

const DisciplineTasksButton = () => {
  const router = useAppRouter();
  const currentDate = dayjs().startOf('day');
  const weekEnd = currentDate.clone().endOf('week');
  const { tasks } = useTasks({
    filter: (task) => {
      if (!task.datetime) return false;
      return task.datetime >= currentDate && task.datetime <= weekEnd && !task.isComplete;
    },
  });
  const theme = useAppTheme();

  return (
    <TouchableOpacity
      onPress={() => {
        router.push('(shared)/disciplinesTasks');
      }}
      style={{ justifyContent: 'center' }}
    >
      {tasks.length ? (
        <View style={[styles.circle, { borderColor: theme.colors.text }]}>
          <Text style={[styles.text, { color: theme.colors.text }]}>{tasks.length}</Text>
        </View>
      ) : (
        <AntDesign name="checkcircleo" size={24} color={theme.colors.text} />
      )}
    </TouchableOpacity>
  );
};

export default DisciplineTasksButton;

const styles = StyleSheet.create({
  circle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontWeight: '500',
    fontSize: 17,
  },
});
