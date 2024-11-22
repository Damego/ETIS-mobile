import dayjs from 'dayjs';
import React from 'react';
import DateTimePicker from 'react-native-ui-datepicker';
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

  return (
    <DateTimePicker
      date={date}
      onChange={({ date }) => onDatePress({ date: dayjs(date) })}
      locale={'ru'}
      minDate={periodStartDate}
      maxDate={periodEndDate}
      firstDayOfWeek={1}
      mode={'single'}
      selectedItemColor={theme.colors.primary}
      calendarTextStyle={{ color: theme.colors.text }}
      headerTextStyle={{ color: theme.colors.text }}
      headerButtonColor={theme.colors.text}
      weekDaysTextStyle={{ color: theme.colors.text }}
      yearContainerStyle={{ backgroundColor: theme.colors.container }}
      monthContainerStyle={{ backgroundColor: theme.colors.container }}
    />
  );
};

const MonthCalendar = React.memo(MonthCalendarComponent);

export default MonthCalendar;
