import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import { Checkbox } from 'expo-checkbox';
import React, { useRef, useState } from 'react';
import { Alert, StyleSheet, TextInput, View } from 'react-native';

import BottomSheetModalBackdrop from '../../components/BottomSheetModalBackdrop';
import ClickableText from '../../components/ClickableText';
import Text from '../../components/Text';
import { useGlobalStyles } from '../../hooks';
import { DisciplineReminder, DisciplineTask } from '../../models/disciplinesTasks';
import { formatTime } from '../../utils/datetime';
import { fontSize } from '../../utils/texts';
import AddReminderBottomModal from './AddReminderBottomModal';
import AddButton from './components/AddButton';
import Reminder from './components/Reminder';

export interface PartialTask {
  description: string;
  // Описание задачи
  reminders: DisciplineReminder[];
  // Список напоминаний к задаче
  isLinkedToPair: boolean;
  // Привязано ли задание к паре
}

const AddTaskModalContent = ({
  onTaskAdd,
  onTaskRemove,
  selectedTask,
  showDisciplineInfo,
  disableCheckbox,
}: {
  onTaskAdd: (task: PartialTask) => void;
  onTaskRemove: (task: DisciplineTask) => void;
  selectedTask?: DisciplineTask;
  showDisciplineInfo?: boolean;
  disableCheckbox?: boolean;
}) => {
  const [description, setDescription] = useState(selectedTask?.description || '');
  const [reminders, setReminders] = useState<DisciplineReminder[]>(selectedTask?.reminders || []);
  const [isLinkedToPair, setLinkedToPair] = useState(!disableCheckbox);
  const globalStyles = useGlobalStyles();
  const reminderModal = useRef<BottomSheetModal>();

  const openReminderModal = () => reminderModal.current?.present();

  const closeReminderModal = () => reminderModal.current.close();

  const removeReminder = (index: number) => () =>
    setReminders((prev) => [...prev.filter((_, ind) => ind !== index)]);

  const addReminder = (datetime: dayjs.Dayjs) => {
    setReminders((prev) => [...prev, new DisciplineReminder(datetime)]);
    closeReminderModal();
  };

  const addTask = () => {
    onTaskAdd({ description, reminders, isLinkedToPair });
  };

  const removeTask = () => {
    Alert.alert('Удаление задания', 'Вы действительно хотите удалить это задание', [
      { text: 'Отмена' },
      {
        text: 'Удалить',
        onPress: () => onTaskRemove(selectedTask),
      },
    ]);
  };

  return (
    <BottomSheetView style={styles.modalContainer}>
      {showDisciplineInfo && selectedTask && (
        <>
          <Text style={styles.disciplineText}>{selectedTask.disciplineName}</Text>
          <Text style={styles.timeText}>{formatTime(selectedTask.datetime)}</Text>
        </>
      )}
      {/* BottomSheetTextInput просто закрывается при открытии клавиатуры */}
      <Text style={styles.titleText}>Описание</Text>
      <TextInput
        style={[globalStyles.border, styles.textInput, globalStyles.fontColorForBlock]}
        placeholderTextColor={globalStyles.inputPlaceholder.color}
        placeholder="Решить 100 задач"
        value={description}
        onChangeText={setDescription}
        multiline
        autoComplete={'off'}
      />

      {!disableCheckbox && (
        <View style={styles.checkboxContainer}>
          <Checkbox
            value={isLinkedToPair}
            onValueChange={setLinkedToPair}
            color={globalStyles.primaryFontColor.color}
          />
          <Text>Привязать задание к этой паре</Text>
        </View>
      )}

      <View style={styles.row}>
        <Text style={styles.titleText}>Напоминания</Text>
        <AddButton onPress={openReminderModal} />
      </View>

      {reminders.length ? (
        reminders.map((rem, index) => (
          <Reminder reminder={rem} onRemove={removeReminder(index)} key={index.toString()} />
        ))
      ) : (
        <Text style={styles.noRemindersText}>Нет напоминаний</Text>
      )}

      <View style={{ height: '10%' }} />

      <View style={styles.buttonsList}>
        {!!selectedTask && (
          <ClickableText
            textStyle={[styles.button, globalStyles.primaryFontColor]}
            text={'Удалить'}
            onPress={removeTask}
          />
        )}
        {!!description && (
          <ClickableText textStyle={styles.button} text={'Сохранить'} onPress={addTask} />
        )}
      </View>

      <BottomSheetModal
        ref={reminderModal}
        backdropComponent={BottomSheetModalBackdrop}
        backgroundStyle={{ backgroundColor: globalStyles.block.backgroundColor }}
      >
        <AddReminderBottomModal onSubmit={addReminder} />
      </BottomSheetModal>
    </BottomSheetView>
  );
};

export default AddTaskModalContent;

const styles = StyleSheet.create({
  modalContainer: {
    padding: '4%',
    gap: 8,
  },
  disciplineText: {
    fontWeight: '600',
    ...fontSize.large,
  },
  timeText: {
    ...fontSize.medium,
  },
  textInput: {
    padding: '2%',
    ...fontSize.large,
  },
  titleText: {
    ...fontSize.big,
    fontWeight: '500',
  },
  buttonsList: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    gap: 8,
    padding: '2%'
  },
  button: {
    fontWeight: '500',
    ...fontSize.medium,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  noRemindersText: {
    fontWeight: '500',
    ...fontSize.medium,
  },
  checkboxContainer: { flexDirection: 'row', gap: 8 },
});
