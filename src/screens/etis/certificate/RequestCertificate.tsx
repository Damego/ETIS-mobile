import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Keyboard, StyleSheet, ToastAndroid, View } from 'react-native';
import { RadioButtonProps, RadioGroup } from 'react-native-radio-buttons-group';
import { Button } from '~/components/Button';
import Card from '~/components/Card';
import Screen from '~/components/Screen';
import Text from '~/components/Text';
import { useAppSelector, useGlobalStyles } from '~/hooks';
import { IAvailableCertificate } from '~/models/certificate';
import { CertificateParam, CertificateRequest } from '~/models/certificateRequest';
import {
  EducationNavigationProp,
  EducationStackParamList,
  EducationStackScreenProps,
} from '~/navigation/types';
import { PopoverElement } from '~/screens/etis/certificate/components/PopoverElement';
import RequestSentScreen from '~/screens/etis/certificate/components/RequestSentScreen';
import { KNOWN_CERTIFICATES, SPECIAL_CERTIFICATES } from '~/screens/etis/certificate/data';
import { httpClient } from '~/utils';
import { toCertificatePayload } from '~/utils/certificate';
import { fontSize } from '~/utils/texts';

import Input from './components/Input';

const specialCerts: [{ id: string; screen: keyof EducationStackParamList }] = [
  { id: '-1', screen: 'CertificateIncome' },
];

const getAvailableCertificates = (
  availableCertificates: readonly IAvailableCertificate[]
): CertificateParam[] => {
  const $availableCertificates = [];
  const ids = availableCertificates.map((cert) => cert.id);

  KNOWN_CERTIFICATES.forEach((certificate) => {
    if (ids.includes(certificate.id)) {
      $availableCertificates.push(certificate);
    }
  });
  // todo
  return [...KNOWN_CERTIFICATES, ...SPECIAL_CERTIFICATES];
};

export default function RequestCertificate({
  route,
}: EducationStackScreenProps<'RequestCertificate'>) {
  const globalStyles = useGlobalStyles();
  const navigation = useNavigation<EducationNavigationProp>();
  const availableCertificates = getAvailableCertificates(route.params);

  const { isDemo } = useAppSelector((state) => state.account);
  const [{ certificateId, note, quantity, delivery, place }, setCertificate] =
    useState<CertificateRequest>({
      certificateId: undefined,
      note: '',
      quantity: '1',
      delivery: '1',
      place: '',
    });

  const [keyboardOpen, setKeyboardOpen] = useState<boolean>(false);
  const [requestSent, setRequestSent] = useState<boolean>(false);

  const changeCertificate = (certificate: Partial<CertificateRequest>) => {
    setCertificate(($cert) => {
      const updatedCert = { ...$cert };
      Object.entries(certificate)
        .filter(([, v]) => v !== undefined)
        .forEach(([k, v]) => {
          updatedCert[k] = v;
        });
      return updatedCert;
    });
  };

  Keyboard.addListener('keyboardDidShow', () => {
    setKeyboardOpen(true);
  });

  Keyboard.addListener('keyboardDidHide', () => {
    setTimeout(() => setKeyboardOpen(false), 60);
  });

  const currentCertificate = useMemo(
    () => availableCertificates.find((s) => s.id === certificateId),
    [certificateId]
  );

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    !currentCertificate?.place && changeCertificate({ place: '' });
  }, [certificateId]);

  const radioFactory = (id: string, name: string) => ({
    id,
    label: name,
    ...globalStyles.textColor,
    labelStyle: [fontSize.medium, globalStyles.textColor, { flex: 1 }],
    containerStyle: { marginHorizontal: 5 },
  });

  const certificateRadioButtons: RadioButtonProps[] = useMemo(
    () =>
      availableCertificates.map((certificate) => radioFactory(certificate.id, certificate.name)),
    []
  );

  const [deliveryWayRadioButtons, quantityRadioButtons]: RadioButtonProps[][] = useMemo(
    () => [
      currentCertificate?.deliveryMethod.map((deliveryWay) =>
        radioFactory(deliveryWay.id, deliveryWay.name)
      ),
      ['1', '2', '3'].slice(0, currentCertificate?.maxQuantity).map((i) => radioFactory(i, i)),
    ],
    [certificateId]
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
          certificateId,
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
      <RequestSentScreen
        certificateId={certificateId}
        note={note}
        quantity={quantity}
        delivery={delivery}
        place={place}
      />
    );
  }

  const isApplicable =
    certificateId &&
    !keyboardOpen &&
    !!place === currentCertificate.place &&
    !!note <= currentCertificate.note &&
    Number(quantity) <= currentCertificate.maxQuantity &&
    !!currentCertificate.deliveryMethod.find((s) => delivery === s.id);

  const specialCert = specialCerts.find((s) => certificateId === s.id);

  return (
    <Screen containerStyle={{ gap: 16 }}>
      <Card>
        <Text style={fontSize.big}>Тип справки</Text>
        <RadioGroup
          radioButtons={certificateRadioButtons}
          onPress={(certId) => changeCertificate({ certificateId: certId })}
          selectedId={certificateId}
          containerStyle={styles.alignStart}
        />
      </Card>

      {certificateId && !specialCert && (
        <>
          <Card>
            <Text style={fontSize.big}>Метод вручения</Text>
            <RadioGroup
              radioButtons={deliveryWayRadioButtons}
              onPress={(delivery) => changeCertificate({ delivery })}
              selectedId={delivery}
              containerStyle={styles.alignStart}
              labelStyle={globalStyles.textColor}
            />
            <Text style={fontSize.big}>Количество (шт.)</Text>
            <RadioGroup
              radioButtons={quantityRadioButtons}
              selectedId={quantity}
              onPress={(quantity) => changeCertificate({ quantity })}
              containerStyle={styles.alignStart}
              labelStyle={globalStyles.textColor}
            />
          </Card>

          <Card>
            {currentCertificate.note && (
              <Input
                name="Примечание"
                placeholder="Заберёт Иванов Андрей Алексеевич"
                value={note}
                onUpdate={(note: string) => changeCertificate({ note })}
                popover={
                  <PopoverElement text="Справки выдаются лично заявителю. Если Вы доверяете получить справку другому лицу, пишите в примечаниях фамилию, имя отчество того, кто будет справку забирать." />
                }
              />
            )}
            {currentCertificate.place && (
              <Input
                name="Место предъявления (организация-работодатель) *"
                placeholder="ОАО НефтьГаз"
                value={place}
                onUpdate={(place: string) => changeCertificate({ place })}
                popover={
                  <PopoverElement text="Название организации необходимо указывать в РОДИТЕЛЬНОМ падеже для соблюдения норм русского языка при формировании текста справки." />
                }
              />
            )}
          </Card>
        </>
      )}

      {specialCert && (
        <View style={styles.buttonContainer}>
          <Button
            text={'Продолжить'}
            onPress={() => navigation.navigate(specialCert.screen)}
            variant={'primary'}
          />
        </View>
      )}

      {isApplicable && (
        <View style={styles.buttonContainer}>
          <Button text={'Заказать'} onPress={confirmSubmit} variant={'primary'} />
        </View>
      )}
    </Screen>
  );
}

export const styles = StyleSheet.create({
  text: {
    ...fontSize.xlarge,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  alignStart: { alignItems: 'flex-start', marginBottom: 10 },
  buttonContainer: {
    marginTop: 'auto',
    marginBottom: '2%',
  },
});
