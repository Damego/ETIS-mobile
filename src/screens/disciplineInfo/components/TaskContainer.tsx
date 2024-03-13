import { BottomSheetModal } from '@gorhom/bottom-sheet';
import dayjs from 'dayjs';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import Text from '../../../components/Text';
import TaskContext from '../../../context/taskContext';
import useBackPress from '../../../hooks/useBackPress';
import useTasks from '../../../hooks/useTasks';
import { DisciplineTask } from '../../../models/disciplinesTasks';
import {
  cancelScheduledTaskNotifications,
  rescheduleTaskNotifications,
  scheduleTaskNotifications,
} from '../../../notifications/taskReminder';
import { fontSize } from '../../../utils/texts';
import { PartialTask } from '../AddTaskModalContent';
import TaskModal from '../TaskModal';
import AddButton from './AddButton';
import TaskList from './TaskList';

export const TaskContainer = ({
  disciplineName,
  disciplineDate,
}: {
  disciplineName: string;
  disciplineDate: dayjs.Dayjs;
}) => {
  const modalRef = useRef<BottomSheetModal>();
  const modalOpened = useRef(false);
  const [selectedTask, setSelectedTask] = useState<DisciplineTask | null>(null);
  const { tasks, addTask, saveTasks, removeTask } = useTasks({
    filter: (task) => task.disciplineName === disciplineName,
  });

  const openModal = () => {
    modalRef.current.present();
    modalOpened.current = true;
  };

  const closeModal = () => {
    modalRef.current.dismiss();
    modalOpened.current = false;
  };

  const handleAddTask = ({ description, reminders, isLinkedToPair }: PartialTask) => {
    if (selectedTask) {
      selectedTask.description = description;
      const notificationIds = selectedTask.reminders.map((rem) => rem.notificationId);
      selectedTask.reminders = reminders;
      rescheduleTaskNotifications(notificationIds, selectedTask);
      saveTasks().then(() => {
        closeModal();
        setSelectedTask(null);
      });
      return;
    }

    const task = DisciplineTask.create(
      disciplineName,
      description,
      isLinkedToPair ? disciplineDate.clone() : null,
      reminders,
      false
    );
    scheduleTaskNotifications(task);
    addTask(task).then(closeModal);
  };

  const onRequestEdit = useCallback((task: DisciplineTask) => {
    setSelectedTask(task);
    openModal();
  }, []);

  const handleTaskRemove = (task: DisciplineTask) => {
    cancelScheduledTaskNotifications({ task });
    removeTask(task).then(closeModal);
  };

  const onTaskComplete = (task: DisciplineTask) => {
    task.isComplete = !task.isComplete;
    saveTasks();
  };

  // ВЕЗДЕ ПРОБЛЕМЫ
  // 1. Библиотека bottom sheet modal не предоставляет информацию о состоянии модалки,
  // поэтому используется ещё один ref
  // 2. Ивент навигации внутри useBackPress не триггерится внутри модалки, поэтому,
  // если выйти из модалки с добавлением напоминания, то она закроется, однако первая не появится :(
  useBackPress(() => {
    if (modalOpened.current) {
      closeModal();
      return true;
    }
    return false;
  });

  const currentDate = dayjs();

  return (
    <View>
      <View style={styles.taskContainer}>
        <Text style={styles.taskText}>Задания</Text>
        <AddButton onPress={openModal} />
      </View>

      <TaskContext.Provider
        value={useMemo(
          () => ({ onRequestEdit, disciplineDate, onComplete: onTaskComplete }),
          [disciplineDate]
        )}
      >
        <TaskList tasks={tasks} />
      </TaskContext.Provider>

      <TaskModal
        ref={modalRef}
        onTaskAdd={handleAddTask}
        onTaskRemove={handleTaskRemove}
        task={selectedTask}
        onDismiss={() => {
          modalOpened.current = false;
        }}
        disableCheckbox={currentDate > disciplineDate}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  taskContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  taskText: {
    fontWeight: '500',
    ...fontSize.large,
  },
});
