import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useFocusEffect } from '@react-navigation/native';
import dayjs from 'dayjs';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BackHandler, StyleSheet } from 'react-native';

import CardHeaderOut from '../../components/CardHeaderOut';
import CenteredText from '../../components/CenteredText';
import Screen from '../../components/Screen';
import useTasks from '../../hooks/useTasks';
import { DisciplineTask } from '../../models/disciplinesTasks';
import { RootStackScreenProps } from '../../navigation/types';
import { formatTime } from '../../utils/datetime';
import { fontSize } from '../../utils/texts';
import { groupItems } from '../../utils/utils';
import HistoryButton from '../disciplineInfo/HistoryButton';
import TaskModal from '../disciplineInfo/TaskModal';
import TaskItem from '../disciplineInfo/components/TaskItem';

const TaskGroup = ({
  tasks,
  onRequestEdit,
}: {
  tasks: DisciplineTask[];
  onRequestEdit: (task: DisciplineTask) => void;
}) => {
  const time = formatTime(tasks[0].datetime, { disableTime: true });

  return (
    <CardHeaderOut topText={time} style={styles.taskListContainer}>
      {tasks.map((task) => (
        <TaskItem task={task} onRequestEdit={onRequestEdit} key={task.id} showDisciplineName />
      ))}
    </CardHeaderOut>
  );
};

const DisciplinesTasks = () => {
  const { tasks, removeTask } = useTasks();

  const [selectedTask, setSelectedTask] = useState<DisciplineTask>();
  const [showInactiveTasks, setShowInactiveTasks] = useState<boolean>(false);
  const modalRef = useRef<BottomSheetModal>();
  const modalOpened = useRef(false);

  const onRequestEdit = (task: DisciplineTask) => {
    setSelectedTask(task);
    modalRef.current.present(task);
    modalOpened.current = true;
  };

  const handleTaskRemove = (task: DisciplineTask) => {
    removeTask(task).then(() => {
      modalRef.current.dismiss();
      modalOpened.current = false;
    });
  };

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (modalOpened.current) {
          modalRef.current.dismiss();
          modalOpened.current = false;
          return true;
        }
        return false;
      };
      const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => sub.remove();
    }, [modalOpened.current])
  );

  const currentDate = dayjs();

  const inactiveTasks = tasks.filter((task) => task.datetime < currentDate).reverse();
  const activeTasks = tasks.filter((task) => task.datetime >= currentDate);
  const groupedActiveTasks = useMemo(
    () => groupItems(activeTasks, (task) => task.datetime.toISOString()),
    [activeTasks]
  );

  return (
    <Screen>
      {!tasks.length && (
        <CenteredText>
          Вы ещё не добавили задания. Нажмите на пару в расписании для подробностей
        </CenteredText>
      )}

      {groupedActiveTasks.map((group) => (
        <TaskGroup key={group[0].id} tasks={group} onRequestEdit={onRequestEdit} />
      ))}

      {!!inactiveTasks.length && (
        <HistoryButton
          onPress={() => setShowInactiveTasks((prev) => !prev)}
          showHistory={showInactiveTasks}
        />
      )}

      {showInactiveTasks && <TaskGroup tasks={inactiveTasks} onRequestEdit={onRequestEdit} />}

      <TaskModal
        onTaskRemove={handleTaskRemove}
        onDismiss={() => {
          modalOpened.current = false;
        }}
        task={selectedTask}
      />
    </Screen>
  );
};

export default DisciplinesTasks;

const styles = StyleSheet.create({
  taskListContainer: {
    gap: 8,
  },
  title: {
    ...fontSize.big,
  },
  showInactiveButton: {
    paddingVertical: '1%',
    paddingHorizontal: '2%',
    marginTop: '2%',
    gap: 4,
  },
});
