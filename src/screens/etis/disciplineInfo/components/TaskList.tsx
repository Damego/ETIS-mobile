import dayjs from 'dayjs';
import React, { useContext, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import BorderLine from '~/components/BorderLine';
import Text from '~/components/Text';
import { useTaskContext } from '~/context/taskContext';
import { DisciplineTask } from '~/models/disciplinesTasks';
import { formatTime } from '~/utils/datetime';
import { fontSize } from '~/utils/texts';

import getGroupedTasks from '../getGroupedTasks';
import HistoryButton from '../HistoryButton';
import TaskItem from './TaskItem';

const GroupedTaskList = ({ tasks }: { readonly tasks: DisciplineTask[] }) => {
  const { t } = useTranslation();
  const { disciplineDate } = useTaskContext();
  const { datetime } = tasks[0];
  let time: string | null;

  if (datetime === null) time = null;
  else if (disciplineDate?.isSame(datetime)) time = t('disciplineInfo.thisPair');
  else time = formatTime(datetime);

  return (
    <>
      {time ? <Text style={styles.title}>{time}</Text> : null}
      <View style={styles.taskListContainer}>
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </View>
    </>
  );
};

const TaskList = ({ tasks }: { readonly tasks: DisciplineTask[] }) => {
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

      {Boolean(groupedInactiveTasks.length) && (
        <HistoryButton
          showHistory={showInactiveTasks}
          onPress={() => setShowInactiveTasks((prev) => !prev)}
        />
      )}

      {showInactiveTasks ? groupedInactiveTasks.map((group, index) => (
        <View key={group[0].id}>
          <GroupedTaskList tasks={group} />
          {groupedInactiveTasks.length - 1 !== index && <BorderLine />}
        </View>
      )) : null}
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
