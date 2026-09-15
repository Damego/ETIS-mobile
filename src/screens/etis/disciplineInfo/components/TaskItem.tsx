import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useContext } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import ThemedCheckbox from '~/components/ThemedCheckbox';
import { useTaskContext } from '~/context/taskContext';
import { useAppTheme } from '~/hooks/theme';
import { DisciplineTask } from '~/models/disciplinesTasks';
import { fontSize } from '~/utils/texts';

const TaskItem = ({ task }: { readonly task: DisciplineTask }) => {
  const theme = useAppTheme();
  const { onRequestEdit, onComplete } = useTaskContext();
  return (
    <View style={styles.container}>
      <ThemedCheckbox
        value={task.isComplete}
        label={task.description}
        style={styles.checkboxAlign}
        onValueChange={() => onComplete(task)}
      />
      <TouchableOpacity style={styles.align} onPress={() => onRequestEdit(task)}>
        <Ionicons name={'pencil-outline'} size={20} color={theme.colors.text} />
      </TouchableOpacity>
    </View>
  );
};

export default TaskItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: '1%',
  },
  checkboxAlign: {
    // чекбокс с описанием занимает всю строку, иконка редактирования прижата вправо
    alignSelf: 'center',
    flexShrink: 1,
  },
  align: {
    alignSelf: 'center',
    alignItems: 'center',
  },
});
