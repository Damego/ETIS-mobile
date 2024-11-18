import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Text from '~/components/Text';
import { useAppTheme } from '~/hooks/theme';
import useTasks from '~/hooks/useTasks';
import { EducationNavigationProp } from '~/navigation/types';

const DisciplineTasksButton = () => {
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
      onPress={() => {
        navigation.navigate('DisciplineTasks');
      }}
      style={{ justifyContent: 'center' }}
    >
      {tasks.length ? (
        <View style={[styles.circle, { borderColor: theme.colors.primary }]}>
          <Text style={[styles.text, { color: theme.colors.primary }]}>{tasks.length}</Text>
        </View>
      ) : (
        <AntDesign name="checkcircleo" size={24} color={theme.colors.text} />
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
