import { BottomSheetModal } from '@gorhom/bottom-sheet';
import dayjs from 'dayjs';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Text from '~/components/Text';
import TaskContext from '~/context/taskContext';
import useTasks from '~/hooks/useTasks';
import { DisciplineTask } from '~/models/disciplinesTasks';
import {
  cancelScheduledTaskNotifications,
  rescheduleTaskNotifications,
  scheduleTaskNotifications,
} from '~/notifications/taskReminder';
import { fontSize } from '~/utils/texts';

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
  const [selectedTask, setSelectedTask] = useState<DisciplineTask | null>(null);
  const { tasks, addTask, saveTasks, removeTask } = useTasks({
    filter: (task) => task.disciplineName === disciplineName,
  });

  const handleAddTask = ({ description, reminders, isLinkedToPair }: PartialTask) => {
    if (selectedTask) {
      selectedTask.description = description;
      const notificationIds = selectedTask.reminders.map((rem) => rem.notificationId);
      selectedTask.reminders = reminders;
      rescheduleTaskNotifications(notificationIds, selectedTask);
      saveTasks().then(() => {
        modalRef.current.dismiss();
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
    addTask(task).then(() => modalRef.current.dismiss());
  };

  const onRequestEdit = useCallback((task: DisciplineTask) => {
    setSelectedTask(task);
    modalRef.current.present();
  }, []);

  const handleTaskRemove = (task: DisciplineTask) => {
    cancelScheduledTaskNotifications({ task });
    removeTask(task).then(() => modalRef.current.dismiss());
  };

  const onTaskComplete = (task: DisciplineTask) => {
    task.isComplete = !task.isComplete;
    saveTasks();
  };

  const currentDate = dayjs();

  return (
    <View>
      <View style={styles.taskContainer}>
        <Text style={styles.taskText}>Задания</Text>
        <AddButton onPress={() => modalRef.current.present()} />
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
        disableCheckbox={currentDate > disciplineDate || (selectedTask && !selectedTask.datetime)}
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
