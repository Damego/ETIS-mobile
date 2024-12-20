import { BottomSheetModal } from '@gorhom/bottom-sheet';
import dayjs from 'dayjs';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import CardHeaderOut from '~/components/CardHeaderOut';
import CenteredText from '~/components/CenteredText';
import Screen from '~/components/Screen';
import Text from '~/components/Text';
import TaskContext, { ITaskContext } from '~/context/taskContext';
import useBackPress from '~/hooks/useBackPress';
import useTasks from '~/hooks/useTasks';
import { DisciplineStorage, DisciplineTask } from '~/models/disciplinesTasks';
import { EducationStackScreenProps } from '~/navigation/types';
import {
  cancelScheduledTaskNotifications,
  rescheduleTaskNotifications,
} from '~/notifications/taskReminder';
import { formatTime } from '~/utils/datetime';
import { fontSize } from '~/utils/texts';
import { groupItems } from '~/utils/utils';

import { PartialTask } from '../disciplineInfo/AddTaskModalContent';
import HistoryButton from '../disciplineInfo/HistoryButton';
import TaskModal from '../disciplineInfo/TaskModal';
import TaskItem from '../disciplineInfo/components/TaskItem';
import getGroupedTasks from '../disciplineInfo/getGroupedTasks';

const TaskGroup = ({ tasks }: { tasks: DisciplineTask[] }) => {
  const date = tasks[0].datetime ? formatTime(tasks[0].datetime, { disableTime: true }) : null;

  const innerGroup = groupItems(tasks, (task) => task.disciplineName);

  return (
    <CardHeaderOut topText={date} style={styles.taskListContainer}>
      {innerGroup.map((group) => (
        <>
          <Text style={styles.disciplineNameText} key={group[0].disciplineName}>
            {group[0].disciplineName}
          </Text>
          {group.map((task) => (
            <TaskItem task={task} key={task.id} />
          ))}
        </>
      ))}
    </CardHeaderOut>
  );
};

const DisciplinesTasks = ({ route }: EducationStackScreenProps<'DisciplineTasks'>) => {
  const { tasks, saveTasks, removeTask } = useTasks();

  const [selectedTask, setSelectedTask] = useState<DisciplineTask>();
  const [showInactiveTasks, setShowInactiveTasks] = useState<boolean>(false);
  const modalRef = useRef<BottomSheetModal>();
  const modalOpened = useRef(false);

  const openModal = () => {
    modalRef.current.present();
    modalOpened.current = true;
  };

  const closeModal = () => {
    modalRef.current.dismiss();
    modalOpened.current = false;
  };

  const onRequestEdit = useCallback((task: DisciplineTask) => {
    setSelectedTask(task);
    openModal();
  }, []);

  const handleTaskAdd = async (partial: PartialTask) => {
    if (!selectedTask) return; // impossible in this case;
    const notificationIds = selectedTask.reminders.map((rem) => rem.notificationId);
    selectedTask.description = partial.description;
    selectedTask.reminders = partial.reminders;

    await rescheduleTaskNotifications(notificationIds, selectedTask);
    await saveTasks();

    closeModal();
    setSelectedTask(null);
  };

  const handleTaskRemove = async (task: DisciplineTask) => {
    await cancelScheduledTaskNotifications({ task });
    await removeTask(task);
    closeModal();
  };

  const onTaskComplete = (task: DisciplineTask) => {
    task.isComplete = !task.isComplete;
    saveTasks();
  };

  useEffect(() => {
    if (route.params?.taskId) {
      DisciplineStorage.getTasks().then((tasks) => {
        const task = tasks.find((task) => task.id === route.params?.taskId);
        setSelectedTask(task);
        openModal();
      });
    }
  }, [route.params?.taskId]);

  useBackPress(
    useCallback(() => {
      if (modalOpened.current) {
        closeModal();
        return true;
      }
      return false;
    }, [])
  );

  const currentDate = dayjs();
  const { groupedActiveTasks, groupedInactiveTasks } = useMemo(
    () => getGroupedTasks(tasks, currentDate),
    [tasks, currentDate]
  );

  const context: ITaskContext = useMemo(
    () => ({ onRequestEdit, onComplete: onTaskComplete }),
    [onRequestEdit]
  );

  return (
    <Screen>
      {!tasks.length && (
        <CenteredText>
          Вы ещё не добавили задания. Нажмите на пару в расписании для подробностей
        </CenteredText>
      )}

      <TaskContext.Provider value={context}>
        {groupedActiveTasks.map((group) => (
          <TaskGroup key={group[0].id} tasks={group} />
        ))}

        {!!groupedInactiveTasks.length && (
          <HistoryButton
            onPress={() => setShowInactiveTasks((prev) => !prev)}
            showHistory={showInactiveTasks}
          />
        )}

        {showInactiveTasks &&
          groupedInactiveTasks.map((group) => <TaskGroup key={group[0].id} tasks={group} />)}
      </TaskContext.Provider>

      <TaskModal
        ref={modalRef}
        onTaskAdd={handleTaskAdd}
        onTaskRemove={handleTaskRemove}
        onDismiss={() => {
          modalOpened.current = false;
        }}
        task={selectedTask}
        showDisciplineInfo
        disableCheckbox
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
  disciplineNameText: {
    fontWeight: '500',
    ...fontSize.medium,
    marginBottom: '1%',
  },
});
