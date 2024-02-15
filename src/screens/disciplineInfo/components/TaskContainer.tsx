import { BottomSheetModal } from '@gorhom/bottom-sheet';
import dayjs from 'dayjs';
import React, { useRef, useState } from 'react';
import { View } from 'react-native';

import Text from '../../../components/Text';
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
  const [selectedTask, setSelectedTask] = useState<DisciplineTask | null>(null);
  const { tasks, addTask, saveTasks, removeTask } = useTasks({
    filter: (task) => task.disciplineName === disciplineName,
  });

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

  const currentDate = dayjs();

  return (
    <View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={[{ fontWeight: '500' }, fontSize.large]}>Задания</Text>
        {disciplineDate > currentDate && <AddButton onPress={() => modalRef.current?.present()} />}
      </View>

      <TaskList tasks={tasks} disciplineDate={disciplineDate} onRequestEdit={onRequestEdit} />

      <TaskModal onTaskAdd={handleAddTask} onTaskRemove={handleTaskRemove} task={selectedTask} />
    </View>
  );
};
