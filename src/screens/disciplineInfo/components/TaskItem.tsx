import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useGlobalStyles } from '../../../hooks';
import { DisciplineTask } from '../../../models/disciplinesTasks';

const TaskItem = ({
  task,
  onRequestEdit,
}: {
  task: DisciplineTask;
  onRequestEdit: (task: DisciplineTask) => void;
}) => {
  const globalStyles = useGlobalStyles();
  return (
    <>
      <View style={[globalStyles.border, styles.outerContainer]}>
        <View style={styles.innerContainer}>
          <Text>{task.description}</Text>
          <TouchableOpacity onPress={() => onRequestEdit(task)} style={{ alignSelf: 'center' }}>
            <Ionicons name={'pencil-outline'} size={20} />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default TaskItem;

const styles = StyleSheet.create({
  outerContainer: {
    padding: '2%',
  },
  innerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
