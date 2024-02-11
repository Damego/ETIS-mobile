import { BottomSheetView } from '@gorhom/bottom-sheet';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import React, { useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import DateTimePicker from 'react-native-ui-datepicker';

import ClickableText from '../../components/ClickableText';
import { useGlobalStyles } from '../../hooks';
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
        style={[globalStyles.border, timePickerStyles.textInput]}
        value={value.hour().toString()}
        onChangeText={handleChange('hours')}
        keyboardType={'numeric'}
      />
      <Text style={fontSize.xlarge}>:</Text>
      <TextInput
        style={[globalStyles.border, timePickerStyles.textInput]}
        value={value.minute().toString()}
        onChangeText={handleChange('minutes')}
        keyboardType={'numeric'}
      />
    </View>
  );
};

const AddReminderBottomModal = ({ onSubmit }: { onSubmit: (datetime: dayjs.Dayjs) => void }) => {
  const [value, setValue] = useState<dayjs.Dayjs>(dayjs());
  const minimumDate = useRef(dayjs());

  const handleDayChange = (date: dayjs.Dayjs) => {
    setValue((prevDate) => date.set('hour', prevDate.hour()).set('minute', prevDate.minute()));
  };

  return (
    <BottomSheetView style={styles.modalView}>
      <DateTimePicker
        date={value}
        onChange={({ date }) => handleDayChange(dayjs(date))}
        locale={'ru'}
        minDate={minimumDate.current}
        firstDayOfWeek={1}
        mode={'single'}
      />
      <Text style={styles.text}>Укажите время</Text>
      <TimePicker value={value} onValueChange={setValue} />
      <ClickableText
        text={'Сохранить'}
        onPress={() => onSubmit(value)}
        viewStyle={styles.saveButton}
        textStyle={styles.text}
      />
    </BottomSheetView>
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
  modalView: {
    marginHorizontal: '2%',
  },
  text: {
    fontWeight: '500',
    ...fontSize.big,
  },
  saveButton: { alignItems: 'flex-end' },
});
