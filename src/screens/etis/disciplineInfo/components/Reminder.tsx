import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Text from '~/components/Text';
import { useAppTheme } from '~/hooks/theme';
import { DisciplineReminder } from '~/models/disciplinesTasks';
import { formatTime } from '~/utils/datetime';
import { fontSize } from '~/utils/texts';

const Reminder = ({
  reminder,
  onRemove,
}: {
  reminder: DisciplineReminder;
  onRemove: () => void;
}) => {
  const theme = useAppTheme();

  return (
    <View style={styles.reminderContainer}>
      <Text style={fontSize.big}>{formatTime(reminder.datetime)}</Text>
      <TouchableOpacity onPress={onRemove}>
        <Ionicons name={'trash-outline'} size={20} color={theme.colors.text2} />
      </TouchableOpacity>
    </View>
  );
};

export default Reminder;

const styles = StyleSheet.create({
  reminderContainer: {
    flexDirection: 'row',
    gap: 6,
  },
});
