import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Keyboard, StyleSheet, ToastAndroid, View } from 'react-native';
import { RadioButtonProps, RadioGroup } from 'react-native-radio-buttons-group';

import { Button } from '~/components/Button';
import Card from '~/components/Card';
import Screen from '~/components/Screen';
import Text from '~/components/Text';
import { useAppSelector, useGlobalStyles } from '~/hooks';
import { CertificateParam } from '~/models/certificateRequest';
import { RootStackNavigationProp, RootStackParamList } from '~/navigation/types';
import { httpClient } from '~/utils';
import { toCertificatePayload } from '~/utils/certificate';
import { fontSize } from '~/utils/texts';
import { Input, PopoverElement } from './CertificateComponents';

const deliveryMethods = [{ id: '1', name: 'лично (в отделе кадров обучающихся)' }];
const specialCerts: [{ id: string; screen: keyof RootStackParamList }] = [
  { id: '-1', screen: 'CertificateIncome' },
];

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
  {
    id: '-1',
    name: 'Справка о доходах (стипендии)',
    note: false,
    maxQuantity: 0,
    place: false,
    deliveryMethod: [],
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
  const navigator = useNavigation<RootStackNavigationProp>();

  Keyboard.addListener('keyboardDidShow', () => {
    setKeyboardOpen(true);
  });

  Keyboard.addListener('keyboardDidHide', () => {
    setTimeout(() => setKeyboardOpen(false), 60);
  });

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
            style={[fontSize.xlarge, { fontWeight: '500', textAlign: 'center' }]}
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

  const specialCert = specialCerts.find((s) => currentId === s.id);

  return (
    <Screen>
      <Card>
        <Text style={fontSize.medium} colorVariant={'block'}>
          Тип справки
        </Text>
        <RadioGroup
          radioButtons={certificateRadioButtons}
          onPress={setCurrentId}
          selectedId={currentId}
          containerStyle={styles.alignStart}
          labelStyle={globalStyles.fontColorForBlock}
        />
      </Card>

      {currentId && !specialCert && (
        <>
          <Card>
            <Text style={fontSize.medium} colorVariant={'block'}>
              Метод вручения
            </Text>
            <RadioGroup
              radioButtons={deliveryWayRadioButtons}
              onPress={setDelivery}
              selectedId={delivery}
              containerStyle={styles.alignStart}
              labelStyle={globalStyles.fontColorForBlock}
            />
            <Text style={fontSize.medium} colorVariant={'block'}>
              Количество
            </Text>
            <RadioGroup
              radioButtons={quantityRadioButtons}
              selectedId={quantity}
              onPress={setQuantity}
              containerStyle={styles.alignStart}
              labelStyle={globalStyles.fontColorForBlock}
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

      {specialCert && (
        <View style={{ position: 'absolute', left: 0, right: 0, bottom: '1%' }}>
          <Button
            text={'Продолжить'}
            onPress={() => navigator.navigate(specialCert.screen)}
            variant={'secondary'}
          />
        </View>
      )}

      {applicable && (
        <View style={{ position: 'absolute', left: 0, right: 0, bottom: '1%' }}>
          <Button text={'Заказать'} onPress={confirmSubmit} variant={'secondary'} />
        </View>
      )}
    </Screen>
  );
}
