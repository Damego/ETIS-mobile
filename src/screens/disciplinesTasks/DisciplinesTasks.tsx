import { Ionicons } from '@expo/vector-icons';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import dayjs from 'dayjs';
import React, { useMemo, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';

import BottomSheetModalBackdrop from '../../components/BottomSheetModalBackdrop';
import CardHeaderOut from '../../components/CardHeaderOut';
import CenteredText from '../../components/CenteredText';
import ClickableText from '../../components/ClickableText';
import Screen from '../../components/Screen';
import { useGlobalStyles } from '../../hooks';
import useTasks from '../../hooks/useTasks';
import { DisciplineTask } from '../../models/disciplinesTasks';
import { formatTime } from '../../utils/datetime';
import { fontSize } from '../../utils/texts';
import { groupItems } from '../../utils/utils';
import AddTaskModalContent from '../disciplineInfo/AddTaskBottomModal';
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
  const globalStyles = useGlobalStyles();
  const { tasks, removeTask } = useTasks();

  const [selectedTask, setSelectedTask] = useState<DisciplineTask>();
  const [showInactiveTasks, setShowInactiveTasks] = useState<boolean>(false);
  const modalRef = useRef<BottomSheetModal>();

  const handleAddTask = () => {};

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

  const inactiveTasks = tasks.filter((task) => task.datetime < currentDate).reverse();
  const activeTasks = tasks.filter((task) => task.datetime >= currentDate);
  const groupedActiveTasks = useMemo(
    () => groupItems(activeTasks, (task) => task.datetime.toISOString()),
    [activeTasks]
  );

  if (!tasks.length) {
    return (
      <CenteredText>
        Вы ещё не добавили задания. Нажмите на пару в расписании для подробностей
      </CenteredText>
    );
  }

  return (
    <Screen>
      {groupedActiveTasks.map((group) => (
        <TaskGroup key={group[0].id} tasks={group} onRequestEdit={onRequestEdit} />
      ))}

      {!!inactiveTasks.length && (
        <ClickableText
          text={`Прошлые`}
          onPress={() => setShowInactiveTasks((prev) => !prev)}
          textStyle={styles.title}
          viewStyle={[globalStyles.border, globalStyles.block, styles.showInactiveButton]}
          icon={
            <Ionicons
              name={showInactiveTasks ? 'arrow-up-outline' : 'arrow-down-outline'}
              size={26}
            />
          }
        />
      )}

      {showInactiveTasks && <TaskGroup tasks={inactiveTasks} onRequestEdit={onRequestEdit} />}

      <BottomSheetModal
        ref={modalRef}
        enableDynamicSizing
        // snapPoints={['50%', '60%']} // wat?
        backdropComponent={BottomSheetModalBackdrop}
      >
        <AddTaskModalContent
          onTaskAdd={handleAddTask}
          selectedTask={selectedTask}
          onTaskRemove={handleTaskRemove}
        />
      </BottomSheetModal>
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
    justifyContent: 'space-between',
  },
});
