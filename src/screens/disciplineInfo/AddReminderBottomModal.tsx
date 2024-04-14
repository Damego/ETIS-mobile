import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import React, { useState } from 'react';
import { StyleSheet, TextInput, ToastAndroid, View } from 'react-native';
import DateTimePicker from 'react-native-ui-datepicker';

import ClickableText from '../../components/ClickableText';
import Text from '../../components/Text';
import { useGlobalStyles } from '../../hooks';
import { useAppTheme } from '../../hooks/theme';
import { fontSize } from '../../utils/texts';

// У библиотеки react-native-ui-datepicker нереально плохо оптимизирован выбор времени, поэтому используется свой
const TimePicker = ({
  value,
  onValueChange,
}: {
  value: dayjs.Dayjs;
  onValueChange: (value: dayjs.Dayjs) => void;
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
        style={[globalStyles.border, timePickerStyles.textInput, globalStyles.fontColorForBlock]}
        placeholderTextColor={globalStyles.inputPlaceholder.color}
        value={value.hour().toString().padStart(2, '0')}
        onChangeText={handleChange('hours')}
        keyboardType={'numeric'}
      />
      <Text style={fontSize.xlarge}>:</Text>
      <TextInput
        style={[globalStyles.border, timePickerStyles.textInput, globalStyles.fontColorForBlock]}
        placeholderTextColor={globalStyles.inputPlaceholder.color}
        value={value.minute().toString().padStart(2, '0')}
        onChangeText={handleChange('minutes')}
        keyboardType={'numeric'}
      />
    </View>
  );
};

const AddReminderBottomModal = ({ onSubmit }: { onSubmit: (datetime: dayjs.Dayjs) => void }) => {
  const minimumDate = dayjs().add(5, 'minute');

  const theme = useAppTheme();
  const [value, setValue] = useState<dayjs.Dayjs>(minimumDate);

  const handleDayChange = (date: dayjs.Dayjs) => {
    setValue((prevDate) => date.set('hour', prevDate.hour()).set('minute', prevDate.minute()));
  };

  const preSubmit = () => {
    if (minimumDate > value) {
      setValue(minimumDate);
      ToastAndroid.show('Невозможно установить дату ниже текущей', ToastAndroid.LONG);
      return;
    }
    onSubmit(value);
  };

  return (
    <>
      <DateTimePicker
        date={value}
        onChange={({ date }) => handleDayChange(dayjs(date))}
        locale={'ru'}
        minDate={minimumDate}
        firstDayOfWeek={1}
        mode={'single'}
        selectedItemColor={theme.colors.primary}
        calendarTextStyle={{ color: theme.colors.textForBlock }}
        headerTextStyle={{ color: theme.colors.textForBlock }}
        headerButtonColor={theme.colors.textForBlock}
        weekDaysTextStyle={{ color: theme.colors.textForBlock }}
        yearContainerStyle={{ backgroundColor: theme.colors.block }}
      />
      <Text style={styles.text}>Укажите время</Text>
      <TimePicker value={value} onValueChange={setValue} />
      <ClickableText
        text={'Сохранить'}
        onPress={preSubmit}
        viewStyle={styles.saveButton}
        textStyle={styles.text}
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
