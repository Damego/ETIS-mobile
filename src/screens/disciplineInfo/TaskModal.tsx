import { BottomSheetModal } from '@gorhom/bottom-sheet';
import React from 'react';

import BottomSheetModalBackdrop from '../../components/BottomSheetModalBackdrop';
import { useAppTheme } from '../../hooks/theme';
import { DisciplineTask } from '../../models/disciplinesTasks';
import AddTaskModalContent, { PartialTask } from './AddTaskModalContent';

interface TaskModalProps {
  onTaskAdd?: (partialTask: PartialTask) => void;
  onTaskRemove: (task: DisciplineTask) => void;
  task?: DisciplineTask;
  onDismiss?: () => void;
}

const TaskModal = React.forwardRef<BottomSheetModal, TaskModalProps>(
  ({ onTaskAdd, onTaskRemove, task, onDismiss }, ref) => {
    const theme = useAppTheme();

    return (
      <BottomSheetModal
        ref={ref}
        enableDynamicSizing
        backdropComponent={BottomSheetModalBackdrop}
        backgroundStyle={{ backgroundColor: theme.colors.block }}
        onDismiss={onDismiss}
      >
        <AddTaskModalContent
          onTaskAdd={onTaskAdd}
          selectedTask={task}
          onTaskRemove={onTaskRemove}
          showDisciplineInfo
        />
      </BottomSheetModal>
    );
  }
);

export default TaskModal;
