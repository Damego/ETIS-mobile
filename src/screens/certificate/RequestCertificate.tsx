import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Keyboard,
  StyleSheet,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import Popover, { PopoverPlacement } from 'react-native-popover-view';
import { RadioButtonProps, RadioGroup } from 'react-native-radio-buttons-group';

import { Button } from '../../components/Button';
import Card from '../../components/Card';
import Screen from '../../components/Screen';
import Text from '../../components/Text';
import { useAppSelector, useGlobalStyles } from '../../hooks';
import { useAppTheme } from '../../hooks/theme';
import { CertificateParam } from '../../models/certificateRequest';
import { httpClient } from '../../utils';
import { toCertificatePayload } from '../../utils/certificate';
import { fontSize } from '../../utils/texts';

const deliveryMethods = [{ id: '1', name: 'лично (в отделе кадров обучающихся)' }];

const certificateType: CertificateParam[] = [
  {
    id: '13',
    name: 'Справка, подтверждающая факт обучения в ПГНИУ',
    note: true,
    maxQuantity: 3,
    place: false,
    deliveryMethod: deliveryMethods,
  },
  {
    id: '7',
    name: 'Справка-вызов (без оплаты)',
    note: true,
    maxQuantity: 1,
    place: true,
    deliveryMethod: deliveryMethods,
  },
  {
    id: '5',
    name: 'Справка в Сбербанк',
    note: true,
    maxQuantity: 3,
    deliveryMethod: deliveryMethods,
    place: false,
  },
  {
    id: '12',
    name: 'Справка для оформления банковской карты платежной системы МИР',
    note: true,
    maxQuantity: 1,
    place: false,
    deliveryMethod: deliveryMethods,
  },
];

export const styles = StyleSheet.create({
  text: {
    ...fontSize.xlarge,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  buttonContainer: {
    paddingVertical: '2%',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  popover: {
    borderRadius: 10,
    padding: '2%',
  },
  input: { margin: '3%', paddingHorizontal: '2%' },
  inputRow: { flexDirection: 'row', alignItems: 'center' },
  width90: { width: '85%' },
  alignStart: { alignItems: 'flex-start', marginBottom: 10 },
});

export default function RequestCertificate() {
  const globalStyles = useGlobalStyles();
  const { isDemo } = useAppSelector((state) => state.auth);
  const [currentId, setCurrentId] = useState<string>();
  const [note, setNote] = useState<string>('');
  const [place, setPlace] = useState<string>('');
  const [quantity, setQuantity] = useState<string>();
  const [delivery, setDelivery] = useState<string>();
  const [keyboardOpen, setKeyboardOpen] = useState<boolean>(false);
  const [requestSent, setRequestSent] = useState<boolean>(false);
  const schemeColor = useColorScheme() === 'light' ? 'black' : 'white';
  const appTheme = useAppTheme();
  const navigator = useNavigation();

  Keyboard.addListener('keyboardDidShow', () => {
    setKeyboardOpen(true);
  });

  Keyboard.addListener('keyboardDidHide', () => {
    setTimeout(() => setKeyboardOpen(false), 60);
  });

  const PopoverElement = useMemo(
    () =>
      ({ text }) => (
        <Popover
          placement={PopoverPlacement.FLOATING}
          from={(_, showPopover) => (
            <TouchableOpacity onPress={showPopover}>
              <AntDesign name="infocirlceo" size={24} color={schemeColor} />
            </TouchableOpacity>
          )}
          popoverStyle={[styles.popover, { backgroundColor: appTheme.colors.block }]}
        >
          <Text style={fontSize.medium} colorVariant={'block'}>{text}</Text>
        </Popover>
      ),
    []
  );

  const Input = useMemo(
    () =>
      ({ name, placeholder, onUpdate, value, popover }) => (
        <>
          <Text style={fontSize.medium} colorVariant={'block'}>{name}</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={[
                fontSize.small,
                globalStyles.fontColorForBlock,
                globalStyles.border,
                styles.input,
                styles.width90,
              ]}
              placeholderTextColor={globalStyles.inputPlaceholder.color}
              placeholder={placeholder}
              onChangeText={onUpdate}
              value={value}
              selectionColor={globalStyles.primaryBackgroundColor.backgroundColor}
            />
            {popover}
          </View>
        </>
      ),
    []
  );

  const currentCertificate = useMemo(
    () => certificateType.find((s) => s.id === currentId),
    [currentId]
  );

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    !currentCertificate?.place && setPlace('');
  }, [currentId]);

  const applicable =
    currentId &&
    !keyboardOpen &&
    !!place === currentCertificate.place &&
    !!note <= currentCertificate.note &&
    Number(quantity) <= currentCertificate.maxQuantity &&
    !!currentCertificate.deliveryMethod.find((s) => delivery === s.id);

  const radioFactory = (id: string, name: string) => ({
    id,
    label: name,
    ...globalStyles.fontColorForBlock,
    labelStyle: [fontSize.medium, globalStyles.fontColorForBlock],
  });

  const certificateRadioButtons: RadioButtonProps[] = useMemo(
    () => certificateType.map((certificate) => radioFactory(certificate.id, certificate.name)),
    []
  );

  const [deliveryWayRadioButtons, quantityRadioButtons]: RadioButtonProps[][] = useMemo(
    () => [
      currentCertificate?.deliveryMethod.map((deliveryWay) =>
        radioFactory(deliveryWay.id, deliveryWay.name)
      ),
      ['1', '2', '3'].slice(0, currentCertificate?.maxQuantity).map((i) => radioFactory(i, i)),
    ],
    [currentId]
  );

  const submitRequest = async () => {
    if (isDemo) {
      ToastAndroid.show('Запросы в демо режиме невозможны!', ToastAndroid.LONG);
      setRequestSent(true);
      return;
    }

    try {
      await httpClient.sendCertificateRequest(
        toCertificatePayload({
          certificateId: currentId,
          place,
          note,
          quantity,
          delivery,
        })
      );
      setRequestSent(true);
    } catch (e) {
      ToastAndroid.show(`Ошибка: ${e}`, ToastAndroid.LONG);
    }
  };

  const confirmSubmit = () => {
    Alert.alert('Подтверждение', 'Проверьте введённые данные и нажмите Подтвердить', [
      {
        text: 'Вернуться',
      },
      {
        text: 'Подтвердить',
        onPress: submitRequest,
      },
    ]);
  };

  if (requestSent) {
    return (
      <Screen>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text
            style={[
              fontSize.xlarge,
              { fontWeight: '500', textAlign: 'center' },
            ]}
            colorVariant={'block'}
          >
            Запрос успешно отправлен!
          </Text>
        </View>
        <View style={{ position: 'absolute', left: 0, right: 0, bottom: '1%' }}>
          <Button
            text={'Вернуться назад'}
            onPress={() => navigator.goBack()}
            variant={'secondary'}
          />
        </View>
      </Screen>
    );
  }
  return (
    <Screen>
      <Card>
        <Text style={fontSize.medium} colorVariant={'block'}>Тип справки</Text>
        <RadioGroup
          radioButtons={certificateRadioButtons}
          onPress={setCurrentId}
          selectedId={currentId}
          containerStyle={styles.alignStart}
        />
      </Card>

      {currentId && (
        <>
          <Card>
            <Text style={fontSize.medium} colorVariant={'block'}>Метод вручения</Text>
            <RadioGroup
              radioButtons={deliveryWayRadioButtons}
              onPress={setDelivery}
              selectedId={delivery}
              containerStyle={styles.alignStart}
            />
            <Text style={fontSize.medium} colorVariant={'block'}>Количество</Text>
            <RadioGroup
              radioButtons={quantityRadioButtons}
              selectedId={quantity}
              onPress={setQuantity}
              containerStyle={styles.alignStart}
            />
          </Card>

          <Card>
            {currentCertificate.note && (
              <Input
                name="Примечание"
                placeholder="Заберёт Иванов Андрей Алексеевич"
                value={note}
                onUpdate={setNote}
                popover={
                  <PopoverElement text="Справки выдаются лично заявителю. Если Вы доверяете получить справку другому лицу, пишите в примечаниях фамилию, имя отчество того, кто будет справку забирать." />
                }
              />
            )}
            {currentCertificate.place && (
              <Input
                name="Место предъявления (организация-работодатель)"
                placeholder="ОАО НефтьГаз"
                value={place}
                onUpdate={setPlace}
                popover={
                  <PopoverElement text="Название организации необходимо указывать в РОДИТЕЛЬНОМ падеже для соблюдения норм русского языка при формировании текста справки." />
                }
              />
            )}
          </Card>
        </>
      )}

      {applicable && (
        <View style={{ position: 'absolute', left: 0, right: 0, bottom: '1%' }}>
          <Button text={'Заказать'} onPress={confirmSubmit} variant={'secondary'} />
        </View>
      )}
    </Screen>
  );
}
