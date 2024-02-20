import { BottomSheetModal } from '@gorhom/bottom-sheet';
import dayjs from 'dayjs';
import React, { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import Text from '../../../components/Text';
import useBackPress from '../../../hooks/useBackPress';
import useTasks from '../../../hooks/useTasks';
import { DisciplineStorage, DisciplineTask } from '../../../models/disciplinesTasks';
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

  const handleAddTask = (partial: PartialTask) => {
    if (selectedTask) {
      selectedTask.description = partial.description;
      selectedTask.reminders = partial.reminders;
      saveTasks().then(() => {
        modalRef.current.dismiss();
        setSelectedTask(null);
      });
      return;
    }
    const task = new DisciplineTask(
      DisciplineStorage.getNextTaskId(), // Логично, не правда ли?
      disciplineName,
      partial.description,
      disciplineDate.clone(),
      partial.reminders
    );

    addTask(task).then(() => modalRef.current.dismiss());
  };

  const onRequestEdit = (task: DisciplineTask) => {
    setSelectedTask(task);
    modalRef.current.present(task);
  };

  const handleTaskRemove = (task: DisciplineTask) => {
    removeTask(task).then(() => {
      modalRef.current.dismiss();
    });
  };

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
        {disciplineDate > currentDate && <AddButton onPress={openModal} />}
      </View>

      <TaskList tasks={tasks} disciplineDate={disciplineDate} onRequestEdit={onRequestEdit} />

      <TaskModal
        ref={modalRef}
        onTaskAdd={handleAddTask}
        onTaskRemove={handleTaskRemove}
        task={selectedTask}
        onDismiss={() => {
          modalOpened.current = false;
        }}
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
