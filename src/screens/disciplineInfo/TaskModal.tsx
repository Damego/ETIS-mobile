import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import React from 'react';

import BottomSheetModalBackdrop from '../../components/BottomSheetModalBackdrop';
import { useAppTheme } from '../../hooks/theme';
import { DisciplineTask } from '../../models/disciplinesTasks';
import AddTaskModalContent, { PartialTask } from './AddTaskModalContent';
import { StyleSheet } from 'react-native';

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
        enableDynamicSizing
        backdropComponent={BottomSheetModalBackdrop}
        backgroundStyle={{ backgroundColor: theme.colors.block }}
        onDismiss={onDismiss}
      >
        <BottomSheetView style={styles.modalContainer}>
        <AddTaskModalContent
          onTaskAdd={onTaskAdd}
          selectedTask={task}
          onTaskRemove={onTaskRemove}
          showDisciplineInfo={showDisciplineInfo}
          disableCheckbox={disableCheckbox}
        />
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

export default TaskModal;

const styles = StyleSheet.create({
  modalContainer: {
    padding: '4%',
    gap: 8,
  },
})