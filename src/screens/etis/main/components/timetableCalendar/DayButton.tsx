import dayjs from 'dayjs';
import React, { useMemo } from 'react';
import { StyleProp, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import Text from '~/components/Text';
import { useGlobalStyles } from '~/hooks';
import { useAppTheme } from '~/hooks/theme';
import { ITheme } from '~/styles/themes';

const getWeekButtonStyle = (
  isCurrentDay: boolean,
  isSelectedDay: boolean,
  globalStyles: ReturnType<typeof useGlobalStyles>,
  theme: ITheme
): StyleProp<ViewStyle> => {
  if (isSelectedDay) {
    return StyleSheet.compose(globalStyles.primaryBackgroundColor, [
      styles.selectedDayContainer,
      { borderColor: theme.colors.primary },
    ]);
  }
  if (isCurrentDay) {
    return StyleSheet.compose(styles.dayContainer, { borderColor: theme.colors.primary });
  }
  return StyleSheet.compose(styles.dayContainer, { borderColor: theme.colors.primaryContrast });
};

const DayButton = ({
  position,
  dayDate,
  selectedDate,
  currentDate,
  onPress,
}: {
  position: number;
  dayDate: dayjs.Dayjs;
  selectedDate: dayjs.Dayjs;
  currentDate: dayjs.Dayjs;
  onPress: (date: dayjs.Dayjs) => void;
}) => {
  const theme = useAppTheme();
  const globalStyles = useGlobalStyles();

  const isSelectedDay = selectedDate.weekday() === position;
  const isCurrentDay = dayDate.diff(currentDate, 'day') === 0;
  const buttonStyle = useMemo(
    () => getWeekButtonStyle(isCurrentDay, isSelectedDay, globalStyles, theme),
    [isCurrentDay, isSelectedDay, globalStyles, theme]
  );

  return (
    <TouchableOpacity onPress={() => onPress(dayDate)} style={buttonStyle}>
      <Text
        style={
          isSelectedDay
            ? [globalStyles.primaryContrastText, styles.selectedDayWeekText]
            : styles.dayWeekText
        }
      >
        {dayDate.format('dd').toUpperCase()}
      </Text>
      <Text style={isSelectedDay ? styles.selectedDayNumberText : styles.dayNumberText}>
        {dayDate.format('D')}
      </Text>
    </TouchableOpacity>
  );
};

export default DayButton;

const styles = StyleSheet.create({
  dayContainer: {
    paddingVertical: '4%',
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 40,
  },
  selectedDayContainer: {
    borderRadius: 40,
    paddingVertical: '4%',
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  selectedDayWeekText: {
    fontWeight: '500',
  },
  dayWeekText: {
    fontWeight: '500',
  },
  selectedDayNumberText: {
    fontSize: 24,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  dayNumberText: {
    fontSize: 24,
    fontWeight: '500',
  },
});
