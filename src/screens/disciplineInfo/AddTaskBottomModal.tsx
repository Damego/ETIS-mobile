import { BottomSheetModal, BottomSheetView, useBottomSheetModal } from '@gorhom/bottom-sheet';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import React, { useRef, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';

import BottomSheetModalBackdrop from '../../components/BottomSheetModalBackdrop';
import ClickableText from '../../components/ClickableText';
import { useGlobalStyles } from '../../hooks';
import { DisciplineReminder, DisciplineTask } from '../../models/disciplinesTasks';
import { fontSize } from '../../utils/texts';
import AddReminderBottomModal from './AddReminderBottomModal';
import AddButton from './components/AddButton';
import Reminder from './components/Reminder';

export interface PartialTask {
  description: string;
  // Описание задачи
  reminders: DisciplineReminder[];
  // Список напоминаний к задаче
}

const AddTaskModalContent = ({
  onTaskAdd,
  onTaskRemove,
  selectedTask,
}: {
  onTaskAdd: (task: PartialTask) => void;
  onTaskRemove: (task: DisciplineTask) => void;
  selectedTask?: DisciplineTask;
}) => {
  const [description, setDescription] = useState(selectedTask?.description || '');
  const [reminders, setReminders] = useState<DisciplineReminder[]>(selectedTask?.reminders || []);
  const bottomSheetModal = useBottomSheetModal();
  const globalStyles = useGlobalStyles();
  const modalRef = useRef<BottomSheetModal>();

  const openModal = () => modalRef.current?.present();
  const closeModal = () => modalRef.current?.dismiss();

  const removeReminder = (index: number) => () =>
    setReminders((prev) => [...prev.filter((_, ind) => ind !== index)]);

  const addReminder = (datetime: dayjs.Dayjs) => {
    setReminders((prev) => [...prev, new DisciplineReminder(datetime)]);
    closeModal();
  };

  const addTask = () => {
    onTaskAdd({ description, reminders });
  };

  const removeTask = () => {
    if (!selectedTask && !description.length && !reminders.length) {
      bottomSheetModal.dismiss();
      return;
    }
    Alert.alert('Удаление задания', 'Вы действительно хотите удалить это задание', [
      { text: 'Отмена' },
      {
        text: 'Удалить',
        onPress: () => {
          if (selectedTask) onTaskRemove(selectedTask);
          else bottomSheetModal.dismiss();
        },
      },
    ]);
  };

  return (
    <BottomSheetView style={{ padding: '4%', gap: 8 }}>
      {/* BottomSheetTextInput просто закрывается при открытии клавиатуры */}
      <TextInput
        style={[globalStyles.border, { padding: '2%', fontSize: 20 }]}
        placeholder="Описание задания"
        value={description}
        onChangeText={setDescription}
        multiline
        autoComplete={'off'}
      />

      <Text style={styles.reminderText}>Напоминания</Text>

      <AddButton onPress={openModal} />

      {reminders.map((rem, index) => (
        <Reminder reminder={rem} onRemove={removeReminder(index)} key={index.toString()} />
      ))}

      <View style={styles.buttonsList}>
        <ClickableText
          textStyle={[styles.button, globalStyles.primaryFontColor]}
          text={'Удалить'}
          onPress={removeTask}
        />
        {!!description && (
          <ClickableText textStyle={styles.button} text={'Сохранить'} onPress={addTask} />
        )}
      </View>

      <BottomSheetModal ref={modalRef} backdropComponent={BottomSheetModalBackdrop}>
        <AddReminderBottomModal onSubmit={addReminder} />
      </BottomSheetModal>
    </BottomSheetView>
  );
};

export default AddTaskModalContent;

const styles = StyleSheet.create({
  reminderText: {
    fontSize: 18,
    fontWeight: '500',
  },
  buttonsList: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    gap: 8,
  },
  button: {
    fontWeight: '500',
    ...fontSize.medium,
  },
});
