import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import Card from '../../../components/Card';
import { DisciplineTask } from '../../../models/disciplinesTasks';
import { fontSize } from '../../../utils/texts';

const TaskItem = ({
  task,
  onRequestEdit,
  showDisciplineName,
}: {
  task: DisciplineTask;
  onRequestEdit: (task: DisciplineTask) => void;
  showDisciplineName?: boolean;
}) => (
  <>
    {showDisciplineName && <Text style={styles.disciplineNameText}>{task.disciplineName}</Text>}
    <Card style={styles.innerContainer}>
      <Text>{task.description}</Text>
      <TouchableOpacity onPress={() => onRequestEdit(task)} style={{ alignSelf: 'center' }}>
        <Ionicons name={'pencil-outline'} size={20} />
      </TouchableOpacity>
    </Card>
  </>
);

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
