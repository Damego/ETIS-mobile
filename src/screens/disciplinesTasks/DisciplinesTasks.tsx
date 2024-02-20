import { BottomSheetModal } from '@gorhom/bottom-sheet';
import dayjs from 'dayjs';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';

import CardHeaderOut from '../../components/CardHeaderOut';
import CenteredText from '../../components/CenteredText';
import Screen from '../../components/Screen';
import useBackPress from '../../hooks/useBackPress';
import useTasks from '../../hooks/useTasks';
import { DisciplineStorage, DisciplineTask } from '../../models/disciplinesTasks';
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

const DisciplinesTasks = ({ route }: RootStackScreenProps<'DisciplineTasks'>) => {
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

  useEffect(() => {
    if (route.params?.taskId) {
      DisciplineStorage.getTasks().then((tasks) => {
        const task = tasks.find((task) => task.id === route.params?.taskId);
        setSelectedTask(task);
        modalRef.current.present();
        modalOpened.current = true;
      });
    }
  }, [route.params?.taskId]);

  useBackPress(
    useCallback(() => {
      if (modalOpened.current) {
        modalRef.current.dismiss();
        modalOpened.current = false;
        return true;
      }
      return false;
    }, [])
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
        ref={modalRef}
        onTaskRemove={handleTaskRemove}
        onDismiss={() => {
          modalOpened.current = false;
        }}
        task={selectedTask}
        showDisciplineInfo
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
