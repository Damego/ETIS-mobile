import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import Text from '~/components/Text';
import { useAppTheme } from '~/hooks/theme';
import useTasks from '~/hooks/useTasks';
import { EducationNavigationProp } from '~/navigation/types';

const DisciplineTasksButton = () => {
  const { t } = useTranslation();
  const currentDate = dayjs().startOf('day');
  const weekEnd = currentDate.clone().endOf('week');
  const { tasks } = useTasks({
    filter: (task) => {
      if (!task.datetime) return false;
      return task.datetime >= currentDate && task.datetime <= weekEnd && !task.isComplete;
    },
  });
  const navigation = useNavigation<EducationNavigationProp>();
  const theme = useAppTheme();

  return (
    <TouchableOpacity
      style={{ justifyContent: 'center' }}
      accessibilityRole='button'
      accessibilityLabel={
        tasks.length
          ? t('timetable.disciplineTasksUnread', { count: tasks.length })
          : t('timetable.disciplineTasks')
      }
      hitSlop={
        {
          top: 12,
          bottom: 12,
          left: 12,
          right: 12,
        }
      }
      onPress={() => {
        navigation.navigate('DisciplineTasks', {});
      }}
    >
      {tasks.length
        ? (
          <View style={[styles.circle, { borderColor: theme.colors.text }]}>
            <Text style={[styles.text, { color: theme.colors.text }]}>{tasks.length}</Text>
          </View>
        )
        : (
          <AntDesign name='checkcircleo' size={24} color={theme.colors.text} />
        )}
    </TouchableOpacity>
  );
};

export default DisciplineTasksButton;

const styles = StyleSheet.create({
  circle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontWeight: '500',
    fontSize: 17,
  },
});
