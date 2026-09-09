import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert, Keyboard, StyleSheet, ToastAndroid, View
} from 'react-native';
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
import { getCertificateData } from '~/screens/etis/certificate/data';
import { httpClient } from '~/utils';
import { toCertificatePayload } from '~/utils/certificate';
import { fontSize } from '~/utils/texts';

import Input from './components/Input';

const specialCerts: [{ id: string; screen: keyof EducationStackParamList }] = [
  { id: '-1', screen: 'CertificateIncome' },
];

const getAvailableCertificates = (
  availableCertificates: readonly IAvailableCertificate[],
  knownCertificates: readonly CertificateParam[],
  specialCertificates: readonly CertificateParam[]
): CertificateParam[] => {
  const $availableCertificates = [];
  const ids = availableCertificates.map((cert) => cert.id);

  knownCertificates.forEach((certificate) => {
    if (ids.includes(certificate.id)) {
      $availableCertificates.push(certificate);
    }
  });
  // todo
  return [...knownCertificates, ...specialCertificates];
};

export default function RequestCertificate({
  route,
}: EducationStackScreenProps<'RequestCertificate'>) {
  const { t } = useTranslation();
  const globalStyles = useGlobalStyles();
  const navigation = useNavigation<EducationNavigationProp>();
  const { knownCertificates, specialCertificates } = getCertificateData();
  const availableCertificates = getAvailableCertificates(route.params, knownCertificates, specialCertificates);

  const { isDemo } = useAppSelector((state) => state.account);
  const [certificateRequest, setCertificate] = useState<CertificateRequest>({
    certificateId: undefined,
    note: '',
    quantity: '1',
    delivery: '1',
    place: '',
  });
  const { certificateId, note, quantity, delivery, place } = certificateRequest;

  const [keyboardOpen, setKeyboardOpen] = useState<boolean>(false);
  const [requestSent, setRequestSent] = useState<boolean>(false);

  const changeCertificate = (certificate: Partial<CertificateRequest>) => {
    setCertificate(($cert) => ({
      ...$cert,
      ...Object.fromEntries(Object.entries(certificate).filter(([, v]) => v !== undefined)),
    }));
  };

  // Подписка на клавиатуру в теле рендера копила бы листенеры
  // без отписки; держим одну пару подписок на монтировании
  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardOpen(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setTimeout(() => setKeyboardOpen(false), 60);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  // Доступные опции зависят от выбранной справки; без выбора — пустые
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
      (currentCertificate?.deliveryMethod ?? []).map((deliveryWay) =>
        radioFactory(deliveryWay.id, deliveryWay.name)
      ),
      ['1', '2', '3'].slice(0, currentCertificate?.maxQuantity).map((i) => radioFactory(i, i)),
    ],
    [certificateId]
  );

  const submitRequest = async () => {
    if (isDemo) {
      ToastAndroid.show(t('certificate.demoModeUnavailable'), ToastAndroid.LONG);
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
      ToastAndroid.show(t('certificate.requestError', { error: e }), ToastAndroid.LONG);
    }
  };

  const confirmSubmit = () => {
    Alert.alert(t('certificate.confirmTitle'), t('certificate.confirmMessage'), [
      {
        text: t('certificate.back'),
      },
      {
        text: t('certificate.confirm'),
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
    currentCertificate != null &&
    certificateId != null &&
    !keyboardOpen &&
    Boolean(place) === currentCertificate.place &&
    Boolean(note) <= currentCertificate.note &&
    Number(quantity) <= currentCertificate.maxQuantity &&
    Boolean(currentCertificate.deliveryMethod.find((s) => delivery === s.id));

  const specialCert = specialCerts.find((s) => certificateId === s.id);

  return (
    <Screen containerStyle={{ gap: 16 }}>
      <Card>
        <Text style={fontSize.big}>{t('certificate.type')}</Text>
        <RadioGroup
          radioButtons={certificateRadioButtons}
          selectedId={certificateId}
          containerStyle={styles.alignStart}
          onPress={(certId) => changeCertificate({ certificateId: certId })}
        />
      </Card>

      {currentCertificate && certificateId && !specialCert ? <>
        <Card>
          <Text style={fontSize.big}>{t('certificate.deliveryMethod')}</Text>
          <RadioGroup
            radioButtons={deliveryWayRadioButtons}
            selectedId={delivery}
            containerStyle={styles.alignStart}
            labelStyle={globalStyles.textColor}
            onPress={(delivery) => changeCertificate({ delivery })}
          />
          <Text style={fontSize.big}>{t('certificate.quantityUnitsLabel')}</Text>
          <RadioGroup
            radioButtons={quantityRadioButtons}
            selectedId={quantity}
            containerStyle={styles.alignStart}
            labelStyle={globalStyles.textColor}
            onPress={(quantity) => changeCertificate({ quantity })}
          />
        </Card>

        <Card>
          {currentCertificate.note ? <Input
            name={t('certificate.noteLabel')}
            placeholder={t('certificate.notePlaceholder')}
            value={note}
            popover={<PopoverElement text={t('certificate.notePopover')} />}
            onUpdate={(note: string) => changeCertificate({ note })}
          /> : null}
          {currentCertificate.place ? <Input
            name={t('certificate.placeRequiredLabel')}
            placeholder={t('certificate.placePlaceholder')}
            value={place}
            popover={<PopoverElement text={t('certificate.placePopover')} />}
            onUpdate={(place: string) => changeCertificate({ place })}
          /> : null}
        </Card>
      </> : null}

      {specialCert ? <View style={styles.buttonContainer}>
        <Button
          text={t('certificate.continue')}
          variant={'primary'}
          onPress={() => navigation.navigate(specialCert.screen as never)}
        />
      </View> : null}

      {isApplicable ? <View style={styles.buttonContainer}>
        <Button text={t('certificate.order')} variant={'primary'} onPress={confirmSubmit} />
      </View> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
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
