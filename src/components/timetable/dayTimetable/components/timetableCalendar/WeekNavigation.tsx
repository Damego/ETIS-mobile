import { AntDesign } from '@expo/vector-icons';
import dayjs from 'dayjs';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import Text from '~/components/Text';
import { useAppTheme } from '~/hooks/theme';
import { capitalizeWord } from '~/utils/texts';

const WeekNavigation = ({
  selectedDate,
  selectedWeek,
  currentWeek,
  firstWeek = 1,
  lastWeek = Number.POSITIVE_INFINITY,
  onPrevPress,
  onNextPress,
  onMainPress,
}: {
  selectedDate: dayjs.Dayjs;
  selectedWeek: number;
  currentWeek?: number;
  firstWeek?: number;
  lastWeek?: number;
  onPrevPress: () => void;
  onNextPress: () => void;
  onMainPress: () => void;
}) => {
  const theme = useAppTheme();
  const canPrev = selectedWeek > firstWeek;
  const canNext = selectedWeek < lastWeek;

  return (
    <View style={styles.navigation}>
      {canPrev
        ? (
          <TouchableOpacity onPress={onPrevPress}>
            <AntDesign name={'left'} size={18} color={theme.colors.text} />
          </TouchableOpacity>
        )
        : (
          <View style={{ width: 20 }} />
        )}
      <View style={styles.titleRow}>
        <Text style={styles.infoText} onPress={onMainPress}>
          {capitalizeWord(selectedDate.format('MMMM'))}
          {selectedWeek ? ` • ${selectedWeek} неделя` : ''}
        </Text>
        {currentWeek !== undefined && selectedWeek !== currentWeek && (
          <TouchableOpacity
            onPress={onMainPress}
            accessibilityRole='button'
            accessibilityLabel='Вернуться к текущей неделе'
            hitSlop={{
              top: 8, bottom: 8, left: 8, right: 8
            }}
          >
            <Text style={[styles.todayText, { color: theme.colors.primary }]}>Сегодня</Text>
          </TouchableOpacity>
        )}
      </View>
      {canNext
        ? (
          <TouchableOpacity onPress={onNextPress}>
            <AntDesign name={'right'} size={18} color={theme.colors.text} />
          </TouchableOpacity>
        )
        : (
          <View style={{ width: 20 }} />
        )}
    </View>
  );
};

export default React.memo(WeekNavigation);

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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  todayText: {
    fontWeight: '500',
    fontSize: 14,
  },
});
