import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import Text from '../../components/Text';
import { useAppTheme } from '../../hooks/theme';
import useTasks from '../../hooks/useTasks';
import { RootStackNavigationProp } from '../types';

const DisciplineTasksButton = () => {
  const date = dayjs().startOf('day');
  const { tasks } = useTasks({
    filter: (task) => {
      if (!task.datetime) return false;
      return task.datetime.diff(date, 'day') === 1;
    },
  });
  const navigation = useNavigation<RootStackNavigationProp>();
  const theme = useAppTheme();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('DisciplineTasks');
      }}
      style={{ justifyContent: 'center', marginRight: '7%' }}
    >
      {tasks.length ? (
        <View style={[styles.circle, { borderColor: theme.colors.primary }]}>
          <Text style={[styles.text, { color: theme.colors.primary }]}>{tasks.length}</Text>
        </View>
      ) : (
        <AntDesign name="checkcircleo" size={28} color={theme.colors.primary} />
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
