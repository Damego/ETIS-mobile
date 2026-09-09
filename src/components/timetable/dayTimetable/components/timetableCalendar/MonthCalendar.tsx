import dayjs from 'dayjs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import DateTimePicker, { useDefaultStyles } from 'react-native-ui-datepicker';

import { useAppTheme } from '~/hooks/theme';
import { DatePressT } from '~/hooks/useTimetable';

const MonthCalendarComponent = ({
  date,
  periodStartDate,
  periodEndDate,
  onDatePress,
}: {
  readonly date: dayjs.Dayjs;
  readonly periodStartDate: dayjs.Dayjs;
  readonly periodEndDate: dayjs.Dayjs;
  readonly onDatePress: DatePressT;
}) => {
  const theme = useAppTheme();
  const { i18n } = useTranslation();
  const defaultStyles = useDefaultStyles(theme.dark ? 'dark' : 'light');

  return (
    <DateTimePicker
      date={date}
      locale={i18n.language}
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
      onChange={({ date }) => onDatePress({ date: dayjs(date) })}
    />
  );
};

const MonthCalendar = React.memo(MonthCalendarComponent);

export default MonthCalendar;
