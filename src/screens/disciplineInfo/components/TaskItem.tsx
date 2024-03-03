import { Ionicons } from '@expo/vector-icons';
import { Checkbox } from 'expo-checkbox';
import React, { useContext } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import Card from '../../../components/Card';
import Text from '../../../components/Text';
import TaskContext from '../../../context/taskContext';
import { useAppTheme } from '../../../hooks/theme';
import { DisciplineTask } from '../../../models/disciplinesTasks';
import { fontSize } from '../../../utils/texts';

const TaskItem = ({
  task,
  showDisciplineName,
}: {
  task: DisciplineTask;
  showDisciplineName?: boolean;
}) => {
  const theme = useAppTheme();
  const { onRequestEdit, onComplete } = useContext(TaskContext);
  return (
    <>
      {showDisciplineName && <Text style={styles.disciplineNameText}>{task.disciplineName}</Text>}
      <Card style={styles.innerContainer}>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Checkbox
            value={task.isComplete}
            onValueChange={() => onComplete(task)}
            color={theme.colors.primary}
          />
          <Text>{task.description}</Text>
        </View>
        <TouchableOpacity onPress={() => onRequestEdit(task)} style={{ alignSelf: 'center' }}>
          <Ionicons name={'pencil-outline'} size={20} color={theme.colors.textForBlock} />
        </TouchableOpacity>
      </Card>
    </>
  );
};

export default TaskItem;

const styles = StyleSheet.create({
  disciplineNameText: {
    fontWeight: '500',
    ...fontSize.medium,
    marginBottom: '1%',
  },
  outerContainer: {
    padding: '2%',
  },
  innerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 0,
  },
});
