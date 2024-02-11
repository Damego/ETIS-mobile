import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { DisciplineReminder } from '../../../models/disciplinesTasks';
import { fontSize } from '../../../utils/texts';
import { formatTime } from '../../../utils/datetime';

const Reminder = ({
  reminder,
  onRemove,
}: {
  reminder: DisciplineReminder;
  onRemove: () => void;
}) => (
  <View style={styles.reminderContainer}>
    <Text style={fontSize.big}>{formatTime(reminder.datetime)}</Text>
    <TouchableOpacity onPress={onRemove}>
      <Ionicons name={'trash-outline'} size={20} />
    </TouchableOpacity>
  </View>
);

export default Reminder;

const styles = StyleSheet.create({
  reminderContainer: {
    flexDirection: 'row',
    gap: 6,
  },
});
