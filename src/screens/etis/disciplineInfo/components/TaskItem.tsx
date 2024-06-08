import { Ionicons } from '@expo/vector-icons';
import { Checkbox } from 'expo-checkbox';
import React, { useContext } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import Text from '~/components/Text';
import TaskContext from '~/context/taskContext';
import { useAppTheme } from '~/hooks/theme';
import { DisciplineTask } from '~/models/disciplinesTasks';
import { fontSize } from '~/utils/texts';

const TaskItem = ({ task }: { task: DisciplineTask }) => {
  const theme = useAppTheme();
  const { onRequestEdit, onComplete } = useContext(TaskContext);
  return (
    <View style={styles.container}>
      <View style={[styles.checkbox, styles.align]}>
        <Checkbox
          value={task.isComplete}
          onValueChange={() => onComplete(task)}
          color={theme.colors.primary}
        />
        <Text>{task.description}</Text>
      </View>
      <TouchableOpacity onPress={() => onRequestEdit(task)} style={styles.align}>
        <Ionicons name={'pencil-outline'} size={20} color={theme.colors.textForBlock} />
      </TouchableOpacity>
    </View>
  );
};

export default TaskItem;

const styles = StyleSheet.create({
  disciplineNameText: {
    fontWeight: '500',
    ...fontSize.medium,
    marginBottom: '1%',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: '1%',
  },
  checkbox: {
    flexDirection: 'row',
    gap: 8,
  },
  align: {
    alignSelf: 'center',
    alignItems: 'center',
  },
});
