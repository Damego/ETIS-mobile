import dayjs from 'dayjs';
import React, { useContext, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import BorderLine from '../../../components/BorderLine';
import Text from '../../../components/Text';
import TaskContext from '../../../context/taskContext';
import { DisciplineTask } from '../../../models/disciplinesTasks';
import { formatTime } from '../../../utils/datetime';
import { fontSize } from '../../../utils/texts';
import HistoryButton from '../HistoryButton';
import getGroupedTasks from '../getGroupedTasks';
import TaskItem from './TaskItem';

const GroupedTaskList = ({ tasks }: { tasks: DisciplineTask[] }) => {
  const { disciplineDate } = useContext(TaskContext);
  const { datetime } = tasks[0];
  let time: string;

  if (tasks[0].datetime === null) time = null;
  else if (disciplineDate.isSame(datetime)) time = 'На эту пару';
  else time = formatTime(datetime);

  return (
    <>
      {time && <Text style={styles.title}>{time}</Text>}
      <View style={styles.taskListContainer}>
        {tasks.map((task) => (
          <TaskItem task={task} key={task.id} />
        ))}
      </View>
    </>
  );
};

const TaskList = ({ tasks }: { tasks: DisciplineTask[] }) => {
  const [showInactiveTasks, setShowInactiveTasks] = useState<boolean>(false);

  const currentDate = dayjs();
  const { groupedActiveTasks, groupedInactiveTasks } = useMemo(
    () => getGroupedTasks(tasks, currentDate),
    [currentDate]
  );

  return (
    <>
      {groupedActiveTasks.map((group, index) => (
        <View key={group[0].id}>
          <GroupedTaskList tasks={group} />
          {groupedActiveTasks.length - 1 !== index && <BorderLine />}
        </View>
      ))}

      {!!groupedInactiveTasks.length && (
        <HistoryButton
          onPress={() => setShowInactiveTasks((prev) => !prev)}
          showHistory={showInactiveTasks}
        />
      )}

      {showInactiveTasks &&
        groupedInactiveTasks.map((group, index) => (
          <View key={group[0].id}>
            <GroupedTaskList tasks={group} />
            {groupedInactiveTasks.length - 1 !== index && <BorderLine />}
          </View>
        ))}
    </>
  );
};

export default TaskList;

const styles = StyleSheet.create({
  taskListContainer: {
    gap: 8,
  },
  title: {
    marginBottom: '2%',
    ...fontSize.big,
  },
  showInactiveButton: {
    paddingVertical: '1%',
    paddingHorizontal: '2%',
    marginTop: '2%',
    justifyContent: 'space-between',
  },
});
