import dayjs from 'dayjs';
import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import ClickableText from '../../../components/ClickableText';
import { DisciplineTask } from '../../../models/disciplinesTasks';
import { formatTime } from '../../../utils/datetime';
import { fontSize } from '../../../utils/texts';
import { groupItems } from '../../../utils/utils';
import TaskItem from './TaskItem';
import { useGlobalStyles } from '../../../hooks';

const GroupedTaskList = ({
  tasks,
  disciplineDate,
  onRequestEdit,
}: {
  tasks: DisciplineTask[];
  disciplineDate: dayjs.Dayjs;
  onRequestEdit: (task: DisciplineTask) => void;
}) => {
  const { datetime } = tasks[0];
  let time: string;

  if (disciplineDate.isSame(datetime)) time = 'На эту пару';
  else time = formatTime(datetime);

  return (
    <>
      <Text style={styles.title}>{time}</Text>
      <View style={styles.taskListContainer}>
        {tasks.map((task) => (
          <TaskItem task={task} onRequestEdit={onRequestEdit} />
        ))}
      </View>
    </>
  );
};

const TaskList = ({
  tasks,
  disciplineDate,
  onRequestEdit,
}: {
  tasks: DisciplineTask[];
  disciplineDate: dayjs.Dayjs;
  onRequestEdit: (task: DisciplineTask) => void;
}) => {
  const [showInactiveTasks, setShowInactiveTasks] = useState<boolean>(false);
  const globalStyles = useGlobalStyles();

  const currentDate = dayjs();

  const inactiveTasks = tasks.filter((task) => task.datetime < currentDate);
  const activeTasks = tasks.filter((task) => task.datetime >= currentDate);
  const groupedActiveTasks = useMemo(
    () => groupItems(activeTasks, (task) => task.datetime.toISOString()),
    [activeTasks]
  );

  return (
    <>
      {groupedActiveTasks.map((group) => (
        <GroupedTaskList
          tasks={group}
          onRequestEdit={onRequestEdit}
          disciplineDate={disciplineDate}
        />
      ))}

      {!!inactiveTasks.length && (
        <ClickableText
          text={`${showInactiveTasks ? 'Скрыть' : 'Показать'} неактивные`}
          onPress={() => setShowInactiveTasks((prev) => !prev)}
          textStyle={styles.title}
          viewStyle={[globalStyles.border, styles.showInactiveButton]}
        />
      )}

      {showInactiveTasks && (
        <GroupedTaskList
          tasks={inactiveTasks}
          disciplineDate={disciplineDate}
          onRequestEdit={onRequestEdit}
        />
      )}
    </>
  );
};

export default TaskList;

const styles = StyleSheet.create({
  taskListContainer: {
    gap: 8,
  },
  title: {
    ...fontSize.big,
    marginBottom: '2%',
  },
  showInactiveButton: {
    padding: '2%',
    marginTop: '2%'
  }
});
