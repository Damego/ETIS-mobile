import React from 'react';

import BottomSheetContent from '~/components/BottomSheetContent';
import BottomSheetModal from '~/components/BottomSheetModal';
import { useAppTheme } from '~/hooks/theme';
import { DisciplineTask } from '~/models/disciplinesTasks';

import AddTaskModalContent, { PartialTask } from './AddTaskModalContent';

interface TaskModalProps {
  readonly onTaskAdd: (partialTask: PartialTask) => void;
  readonly onTaskRemove: (task: DisciplineTask) => void;
  readonly task?: DisciplineTask;
  readonly onDismiss?: () => void;
  readonly showDisciplineInfo?: boolean;
  readonly disableCheckbox?: boolean;
}

const TaskModal = React.forwardRef<BottomSheetModal, TaskModalProps>(
  ({ onTaskAdd, onTaskRemove, task, onDismiss, showDisciplineInfo, disableCheckbox }, ref) => {
    const theme = useAppTheme();

    return (
      <BottomSheetModal
        ref={ref}
        backgroundStyle={{ backgroundColor: theme.colors.container }}
        snapPoints={['50%', '100%']}
        onDismiss={onDismiss}
      >
        <BottomSheetContent style={{ gap: 8 }}>
          <AddTaskModalContent
            selectedTask={task}
            showDisciplineInfo={showDisciplineInfo}
            disableCheckbox={disableCheckbox}
            onTaskAdd={onTaskAdd}
            onTaskRemove={onTaskRemove}
          />
        </BottomSheetContent>
      </BottomSheetModal>
    );
  }
);

export default TaskModal;
