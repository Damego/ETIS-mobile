import { BottomSheetView } from '@gorhom/bottom-sheet';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import React, { useRef, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import DateTimePicker from 'react-native-ui-datepicker';

import ClickableText from '../../components/ClickableText';
import { useGlobalStyles } from '../../hooks';

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
    <View style={{ flexDirection: 'row' }}>
      <TextInput
        style={[
          globalStyles.border,
          {
            fontSize: 26,
            paddingVertical: '1%',
            paddingHorizontal: '2%',
            alignItems: 'center',
            justifyContent: 'center',
          },
        ]}
        value={value.hour().toString()}
        onChangeText={handleChange('hours')}
        keyboardType={'numeric'}
      />
      <Text style={{ fontSize: 26 }}>:</Text>
      <TextInput
        style={[
          globalStyles.border,
          {
            fontSize: 26,
            paddingVertical: '1%',
            paddingHorizontal: '2%',
            alignItems: 'center',
            justifyContent: 'center',
          },
        ]}
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
    <BottomSheetView style={{ marginHorizontal: '2%' }}>
      <DateTimePicker
        date={value}
        onChange={({ date }) => handleDayChange(dayjs(date))}
        locale={'ru'}
        minDate={minimumDate.current}
        firstDayOfWeek={1}
        mode={'single'}
      />
      <Text style={{ fontSize: 18, fontWeight: '500' }}>Укажите время</Text>
      <TimePicker value={value} onValueChange={setValue} />
      <ClickableText
        text={'Сохранить'}
        onPress={() => onSubmit(value)}
        viewStyle={{ alignItems: 'flex-end' }}
        textStyle={{ fontSize: 18, fontWeight: '500' }}
      />
    </BottomSheetView>
  );
};

export default AddReminderBottomModal;
