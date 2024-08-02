import { AntDesign } from '@expo/vector-icons';
import dayjs from 'dayjs';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Text from '~/components/Text';
import { capitalizeWord } from '~/utils/texts';

const WeekNavigation = ({
  selectedDate,
  selectedWeek,
  onPrevPress,
  onNextPress,
  onMainPress,
}: {
  selectedDate: dayjs.Dayjs;
  selectedWeek: number;
  onPrevPress: () => void;
  onNextPress: () => void;
  onMainPress: () => void;
}) => {
  return (
    <View style={styles.navigation}>
      <TouchableOpacity onPress={onPrevPress}>
        <AntDesign name={'left'} size={18} />
      </TouchableOpacity>
      <Text style={styles.infoText} onPress={onMainPress}>
        {capitalizeWord(selectedDate.format('MMMM'))}
        {selectedWeek ? ` • ${selectedWeek} неделя` : ''}
      </Text>
      <TouchableOpacity onPress={onNextPress}>
        <AntDesign name={'right'} size={18} />
      </TouchableOpacity>
    </View>
  );
};

export default WeekNavigation;

const styles = StyleSheet.create({
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  infoText: {
    fontWeight: '500',
    fontSize: 18,
  },
});
