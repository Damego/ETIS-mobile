import 'dayjs/locale/ru';

import { BottomSheetModal as ExpoBottomSheetModal } from '@expo/ui/community/bottom-sheet';
import dayjs from 'dayjs';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert, Pressable, StyleSheet, TextInput, View
} from 'react-native';

import BottomSheetContent from '~/components/BottomSheetContent';
import BottomSheetModal from '~/components/BottomSheetModal';
import ClickableText from '~/components/ClickableText';
import Text from '~/components/Text';
import ThemedCheckbox from '~/components/ThemedCheckbox';
import { useGlobalStyles } from '~/hooks';
import { DisciplineReminder, DisciplineTask } from '~/models/disciplinesTasks';
import { formatTime } from '~/utils/datetime';
import { fontSize } from '~/utils/texts';

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
  readonly onTaskAdd: (task: PartialTask) => void;
  readonly onTaskRemove: (task: DisciplineTask) => void;
  readonly selectedTask?: DisciplineTask;
  readonly showDisciplineInfo?: boolean;
  readonly disableCheckbox?: boolean;
}) => {
  const { t } = useTranslation();
  const [description, setDescription] = useState(selectedTask?.description || '');
  const [reminders, setReminders] = useState<DisciplineReminder[]>(selectedTask?.reminders || []);
  const [isLinkedToPair, setLinkedToPair] = useState(!disableCheckbox);
  const globalStyles = useGlobalStyles();
  const reminderModal = useRef<ExpoBottomSheetModal | null>(null);

  const openReminderModal = () => reminderModal.current?.present();

  const closeReminderModal = () => reminderModal.current?.close();

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
    Alert.alert(t('disciplineInfo.taskDeletion'), t('disciplineInfo.taskDeletionConfirm'), [
      { text: t('common.cancel') },
      {
        text: t('common.delete'),
        onPress: () => {
          if (selectedTask) onTaskRemove(selectedTask);
        },
      },
    ]);
  };

  return (
    <>
      {showDisciplineInfo && selectedTask ? <>
        <Text style={styles.disciplineText}>{selectedTask.disciplineName}</Text>
        {selectedTask.datetime ? <Text style={styles.timeText}>{formatTime(selectedTask.datetime)}</Text> : null}
      </> : null}
      {/* BottomSheetTextInput просто закрывается при открытии клавиатуры */}
      <Text style={styles.titleText}>{t('disciplineInfo.description')}</Text>
      <TextInput
        multiline
        style={[globalStyles.border, styles.textInput, globalStyles.textColor2]}
        placeholderTextColor={globalStyles.inputPlaceholder.color}
        placeholder={t('disciplineInfo.descriptionPlaceholder')}
        value={description}
        autoComplete={'off'}
        onChangeText={setDescription}
      />

      {/* Выставить привязку к паре можно только во время создания задания,
      во время редактирования этого сделать нельзя */}
      {!disableCheckbox && (
        <Pressable
          style={styles.checkboxContainer}
          onPress={() => setLinkedToPair((prev) => !prev)}
        >
          <ThemedCheckbox
            style={styles.checkbox}
            value={isLinkedToPair}
            onValueChange={setLinkedToPair}
          />
          <Text style={styles.checkboxLabel}>{t('disciplineInfo.linkToPair')}</Text>
        </Pressable>
      )}

      <View style={styles.row}>
        <Text style={styles.titleText}>{t('disciplineInfo.reminders')}</Text>
        <AddButton onPress={openReminderModal} />
      </View>

      {reminders.length
        ? (
          reminders.map((rem, index) => (
            <Reminder key={index.toString()} reminder={rem} onRemove={removeReminder(index)} />
          ))
        )
        : (
          <Text style={styles.noRemindersText}>{t('disciplineInfo.noReminders')}</Text>
        )}

      <View style={{ height: '10%' }} />

      <View style={styles.buttonsList}>
        {Boolean(selectedTask) && (
          <ClickableText
            textStyle={[styles.button, globalStyles.primaryText]}
            text={t('common.delete')}
            onPress={removeTask}
          />
        )}
        {Boolean(description) && (
          <ClickableText textStyle={styles.button} text={t('common.save')} onPress={addTask} />
        )}
      </View>

      <BottomSheetModal
        ref={reminderModal}
        snapPoints={['50%', '100%']}
      >
        <BottomSheetContent>
          <AddReminderBottomModal onSubmit={addReminder} />
        </BottomSheetContent>
      </BottomSheetModal>
    </>
  );
};

export default AddTaskModalContent;

const styles = StyleSheet.create({
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
    padding: '2%',
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
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    // чекбокс из @expo/ui не растягивается на высоту строки — берём её у текста
    alignSelf: 'flex-start',
  },
  checkboxLabel: {
    flex: 1,
    ...fontSize.medium,
  },
});
