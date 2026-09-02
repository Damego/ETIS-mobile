import React from 'react';

import BottomSheetContent from '~/components/BottomSheetContent';
import BottomSheetModal from '~/components/BottomSheetModal';
import { useAppTheme } from '~/hooks/theme';
import { DisciplineTask } from '~/models/disciplinesTasks';

import AddTaskModalContent, { PartialTask } from './AddTaskModalContent';

interface TaskModalProps {
  onTaskAdd: (partialTask: PartialTask) => void;
  onTaskRemove: (task: DisciplineTask) => void;
  task?: DisciplineTask;
  onDismiss?: () => void;
  showDisciplineInfo?: boolean;
  disableCheckbox?: boolean;
}

const TaskModal = React.forwardRef<BottomSheetModal, TaskModalProps>(
  ({ onTaskAdd, onTaskRemove, task, onDismiss, showDisciplineInfo, disableCheckbox }, ref) => {
    const theme = useAppTheme();

    return (
      <BottomSheetModal
        ref={ref}
        backgroundStyle={{ backgroundColor: theme.colors.container }}
        onDismiss={onDismiss}
        snapPoints={['50%', '100%']}
      >
        <BottomSheetContent style={{ gap: 8 }}>
          <AddTaskModalContent
            onTaskAdd={onTaskAdd}
            selectedTask={task}
            onTaskRemove={onTaskRemove}
            showDisciplineInfo={showDisciplineInfo}
            disableCheckbox={disableCheckbox}
          />
        </BottomSheetContent>
      </BottomSheetModal>
    );
  }
);

export default TaskModal;
