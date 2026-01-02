import dayjs from 'dayjs';
import React from 'react';
import DateTimePicker, { useDefaultStyles } from 'react-native-ui-datepicker';
import { useAppTheme } from '~/hooks/theme';
import { DatePressT } from '~/hooks/useTimetable';

const MonthCalendarComponent = ({
  date,
  periodStartDate,
  periodEndDate,
  onDatePress,
}: {
  date: dayjs.Dayjs;
  periodStartDate: dayjs.Dayjs;
  periodEndDate: dayjs.Dayjs;
  onDatePress: DatePressT;
}) => {
  const theme = useAppTheme();
  const defaultStyles = useDefaultStyles(theme.dark ? 'dark' : 'light');

  return (
    <DateTimePicker
      date={date}
      onChange={({ date }) => onDatePress({ date: dayjs(date) })}
      locale={'ru'}
      minDate={periodStartDate}
      maxDate={periodEndDate}
      firstDayOfWeek={1}
      mode={'single'}
      styles={{
        ...defaultStyles,
        selected: {
          ...defaultStyles.selected,
          backgroundColor: theme.colors.primary,
        },
        selected_label: {
          ...defaultStyles.selected_label,
          color: theme.colors.background,
        },
      }}
    />
  );
};

const MonthCalendar = React.memo(MonthCalendarComponent);

export default MonthCalendar;
