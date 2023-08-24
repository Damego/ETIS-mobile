import { AntDesign } from '@expo/vector-icons';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import Popover, { PopoverPlacement } from 'react-native-popover-view';
import { RadioButtonProps, RadioGroup } from 'react-native-radio-buttons-group';

import Screen from '../../components/Screen';
import { useGlobalStyles } from '../../hooks';
import { useAppColorScheme } from '../../hooks/theme';
import { CertificateParam } from '../../models/certificateRequest';
import { httpClient } from '../../utils';
import { toCertificatePayload } from '../../utils/certificate';
import { fontSize } from '../../utils/texts';

const deliveryMethods = [{ id: '1', name: 'лично (в отделе кадров обучающихся)' }];

const certificateType: CertificateParam[] = [
  {
    id: '13',
    name: 'справка, подтверждающая факт обучения в ПГНИУ',
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
  container: {
    paddingHorizontal: '1%',
    marginBottom: '3%',
  },
  button: {
    marginBottom: '50%',
  },
  text: {
    ...fontSize.xlarge,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  bottomButton: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: '85%',
    alignItems: 'center',
  },
  buttonContainer: {
    height: '12%',
    width: '90%',
    marginTop: '5%',
    paddingHorizontal: '5%',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  popover: {
    borderRadius: 10,
    padding: '2%',
  },
  input: { margin: '3%', paddingStart: '1%' },
  inputRow: { flexDirection: 'row', alignItems: 'center' },
  width90: { width: '90%' },
  alignStart: { alignItems: 'flex-start', marginBottom: 10 },
});

export default function RequestCertificate() {
  const globalStyles = useGlobalStyles();
  const [currentId, setCurrentId] = useState<string>();
  const [note, setNote] = useState<string>('');
  const [place, setPlace] = useState<string>('');
  const [quantity, setQuantity] = useState<string>();
  const [delivery, setDelivery] = useState<string>();
  const [placePopover, setPlacePopover] = useState<boolean>(false);
  const [notePopover, setNotePopover] = useState<boolean>(false);
  const [keyboardOpen, setKeyboardOpen] = useState<boolean>(false);
  const schemeColor = useAppColorScheme() === 'light' ? 'black' : 'white';

  Keyboard.addListener('keyboardDidShow', () => {
    setKeyboardOpen(true);
  });

  Keyboard.addListener('keyboardDidHide', () => {
    setKeyboardOpen(false);
  });

  const PopoverElement = useMemo(
    () =>
      ({ isVisible, onPress, text }) => (
        <Popover
          placement={PopoverPlacement.FLOATING}
          isVisible={isVisible}
          from={
            <TouchableOpacity onPress={() => onPress(true)}>
              <AntDesign name="infocirlce" size={24} color={schemeColor} />
            </TouchableOpacity>
          }
          popoverStyle={styles.popover}
          onRequestClose={() => onPress(false)}
        >
          <Text>{text}</Text>
        </Popover>
      ),
    []
  );

  const Input = useMemo(
    () =>
      ({ name, placeholder, onUpdate, value }) => (
        <View style={styles.width90}>
          <Text style={[fontSize.medium, globalStyles.textColor]}>{name}</Text>
          <TextInput
            style={[fontSize.small, globalStyles.textColor, globalStyles.border, styles.input]}
            placeholderTextColor="#837373"
            placeholder={placeholder}
            onChangeText={onUpdate}
            value={value}
            selectionColor={globalStyles.primaryBackgroundColor.backgroundColor}
          />
        </View>
      ),
    []
  );

  const currentCertificate = useMemo(
    () => certificateType.find((s) => s.id === currentId),
    [currentId]
  );

  useEffect(() => {
    !currentCertificate?.place && setPlace('');
  }, [currentId]);

  const applicable = useMemo(
    () =>
      currentId &&
      !keyboardOpen &&
      !!place === currentCertificate.place &&
      !!note <= currentCertificate.note &&
      Number(quantity) <= currentCertificate.maxQuantity &&
      !!currentCertificate.deliveryMethod.find((s) => delivery === s.id),
    [note, place, quantity, delivery, keyboardOpen, currentId]
  );

  const radioFactory = (id: string, name: string) => ({
    id,
    label: name,
    ...globalStyles.textColor,
    labelStyle: [fontSize.medium, globalStyles.textColor],
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

  return (
    <Screen>
      <View style={[styles.container, globalStyles.border, globalStyles.block]}>
        <Text style={[fontSize.medium, globalStyles.textColor]}>Выберите тип справки</Text>

        <RadioGroup
          radioButtons={certificateRadioButtons}
          onPress={setCurrentId}
          selectedId={currentId}
          containerStyle={styles.alignStart}
        />
      </View>
      {currentId && (
        <>
          <View style={[styles.container, globalStyles.border, globalStyles.block]}>
            <Text style={[fontSize.medium, globalStyles.textColor]}>Выберите метод вручения</Text>
            <RadioGroup
              radioButtons={deliveryWayRadioButtons}
              onPress={setDelivery}
              selectedId={delivery}
              containerStyle={styles.alignStart}
            />
            <Text style={[fontSize.medium, globalStyles.textColor]}>Выберите Количество</Text>
            <RadioGroup
              radioButtons={quantityRadioButtons}
              selectedId={quantity}
              onPress={setQuantity}
              containerStyle={styles.alignStart}
            />
          </View>
          <View style={[styles.container, globalStyles.border, globalStyles.block]}>
            {currentCertificate.note && (
              <View style={styles.inputRow}>
                <Input
                  name="Примечание"
                  placeholder="Заберёт Иванов Андрей Алексеевич"
                  value={note}
                  onUpdate={setNote}
                />

                <PopoverElement
                  isVisible={notePopover}
                  onPress={setNotePopover}
                  text="Справки выдаются лично заявителю. Если Вы доверяете получить справку другому лицу, пишите в примечаниях фамилию, имя отчество того, кто будет справку забирать."
                />
              </View>
            )}
            {currentCertificate.place && (
              <View style={styles.inputRow}>
                <View style={styles.width90}>
                  <Input
                    name="Место предъявления (организация-работодатель)"
                    placeholder="ОАО НефтьГаз"
                    value={place}
                    onUpdate={setPlace}
                  />
                </View>
                <PopoverElement
                  isVisible={placePopover}
                  onPress={setPlacePopover}
                  text="Название организации необходимо указывать в РОДИТЕЛЬНОМ падеже для соблюдения норм русского языка при формировании текста справки."
                ></PopoverElement>
              </View>
            )}
          </View>
        </>
      )}
      <View style={styles.bottomButton}>
        {applicable && (
          <TouchableOpacity
            onPress={() =>
              httpClient
                .sendCertificateRequest(
                  toCertificatePayload({
                    certificateId: currentId,
                    place,
                    note,
                    quantity,
                    delivery,
                  })
                )
                .then()
                .catch((e) => ToastAndroid.show('Ошибка: ' + e, ToastAndroid.LONG))
            }
            activeOpacity={0.6}
            style={[styles.buttonContainer, globalStyles.primaryBackgroundColor]}
            disabled={!applicable}
          >
            <Text style={styles.text}>Заказать!</Text>
          </TouchableOpacity>
        )}
      </View>
    </Screen>
  );
}
