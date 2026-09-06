import 'dayjs/locale/ru';

import dayjs from 'dayjs';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  StyleSheet, TextInput, ToastAndroid, View
} from 'react-native';
import DateTimePicker, { useDefaultStyles } from 'react-native-ui-datepicker';

import ClickableText from '~/components/ClickableText';
import Text from '~/components/Text';
import { useGlobalStyles } from '~/hooks';
import { useAppTheme } from '~/hooks/theme';
import { fontSize } from '~/utils/texts';

// У библиотеки react-native-ui-datepicker нереально плохо оптимизирован выбор времени, поэтому используется свой
const TimePicker = ({
  value,
  onValueChange,
}: {
  readonly value: dayjs.Dayjs;
  readonly onValueChange: (value: dayjs.Dayjs) => void;
}) => {
  const globalStyles = useGlobalStyles();

  const handleChange = (type: 'hours' | 'minutes') => (text: string) => {
    const $value = Number(text) || 0;
    if (type === 'hours' && $value >= 0 && $value < 24) {
      onValueChange(value.clone().set('hours', $value));
    } else if (type === 'minutes' && $value >= 0 && $value < 60) {
      onValueChange(value.clone().set('minutes', $value));
    }
  };

  return (
    <View style={timePickerStyles.container}>
      <TextInput
        style={[globalStyles.border, timePickerStyles.textInput, globalStyles.textColor2]}
        placeholderTextColor={globalStyles.inputPlaceholder.color}
        value={value.hour().toString().padStart(2, '0')}
        keyboardType={'numeric'}
        onChangeText={handleChange('hours')}
      />
      <Text style={fontSize.xlarge}>:</Text>
      <TextInput
        style={[globalStyles.border, timePickerStyles.textInput, globalStyles.textColor2]}
        placeholderTextColor={globalStyles.inputPlaceholder.color}
        value={value.minute().toString().padStart(2, '0')}
        keyboardType={'numeric'}
        onChangeText={handleChange('minutes')}
      />
    </View>
  );
};

const AddReminderBottomModal = ({ onSubmit }: { readonly onSubmit: (datetime: dayjs.Dayjs) => void }) => {
  const { t } = useTranslation();
  const minimumDate = dayjs().add(5, 'minute');

  const theme = useAppTheme();
  const defaultStyles = useDefaultStyles(theme.dark ? 'dark' : 'light');
  const [value, setValue] = useState<dayjs.Dayjs>(minimumDate);

  const handleDayChange = (date: dayjs.Dayjs) => {
    setValue((prevDate) => date.set('hour', prevDate.hour()).set('minute', prevDate.minute()));
  };

  const preSubmit = () => {
    if (minimumDate > value) {
      setValue(minimumDate);
      ToastAndroid.show(t('disciplineInfo.reminderDateInPast'), ToastAndroid.LONG);
      return;
    }
    onSubmit(value);
  };

  return (
    <>
      <DateTimePicker
        date={value}
        locale={'ru'}
        minDate={minimumDate}
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
          day_label: {
            ...defaultStyles.day_label,
            color: theme.colors.text2,
          },
          month_selector_label: {
            ...defaultStyles.month_selector_label,
            color: theme.colors.text2,
          },
          year_selector_label: {
            ...defaultStyles.year_selector_label,
            color: theme.colors.text2,
          },
          button_next_image: {
            ...defaultStyles.button_next_image,
            tintColor: theme.colors.text2,
          },
          button_prev_image: {
            ...defaultStyles.button_prev_image,
            tintColor: theme.colors.text2,
          },
          weekday_label: {
            ...defaultStyles.weekday_label,
            color: theme.colors.text2,
          },
          years: {
            ...defaultStyles.years,
            backgroundColor: theme.colors.container,
          },
        }}
        onChange={({ date }) => handleDayChange(dayjs(date))}
      />
      <Text style={styles.text}>{t('disciplineInfo.setTime')}</Text>
      <TimePicker value={value} onValueChange={setValue} />
      <ClickableText
        text={t('common.save')}
        viewStyle={styles.saveButton}
        textStyle={styles.text}
        onPress={preSubmit}
      />
    </>
  );
};

export default AddReminderBottomModal;

const timePickerStyles = StyleSheet.create({
  container: { flexDirection: 'row' },
  textInput: {
    fontSize: 26,
    paddingVertical: '1%',
    paddingHorizontal: '2%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const styles = StyleSheet.create({
  text: {
    fontWeight: '500',
    ...fontSize.big,
  },
  saveButton: { alignSelf: 'flex-end' },
});
