import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { Button } from '~/components/Button';
import Card from '~/components/Card';
import Screen from '~/components/Screen';
import Text from '~/components/Text';
import { CertificateRequest } from '~/models/certificateRequest';
import { getCertificateData } from '~/screens/etis/certificate/data';
import { fontSize } from '~/utils/texts';

const RequestSentScreen = ({
  certificateId,
  note,
  quantity,
  delivery,
  place,
}: CertificateRequest) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { knownCertificates, deliveryMethods } = getCertificateData();

  const certificateName = knownCertificates.find((cert) => cert.id === certificateId)?.name;
  const deliveryMethodName = deliveryMethods.find((method) => method.id === delivery)?.name;

  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.titleText}>{t('certificate.requestSentTitle')}</Text>

        <Text style={styles.detailsTitleText}>{t('certificate.details')}</Text>

        <Card>
          <Text style={styles.paragraphText}>{t('certificate.nameLabel')}</Text>
          <Text style={fontSize.big}>{certificateName}</Text>

          <Text style={styles.paragraphText}>{t('certificate.quantityLabel')}</Text>
          <Text style={fontSize.big}>{t('certificate.piecesCount', { quantity })}</Text>

          {note ? <>
            <Text style={styles.paragraphText}>{t('certificate.noteLabel')}</Text>
            <Text style={fontSize.big}>{note}</Text>
          </> : null}

          <Text style={styles.paragraphText}>{t('certificate.deliveryMethod')}</Text>
          <Text style={fontSize.big}>{deliveryMethodName}</Text>

          {place ? <>
            <Text style={styles.paragraphText}>{t('certificate.placeLabel')}</Text>
            <Text style={fontSize.big}>{place}</Text>
          </> : null}
        </Card>
      </View>

      <View style={{ bottom: '1%' }}>
        <Button
          text={t('certificate.backButton')}
          variant={'primary'}
          onPress={() => navigation.goBack()}
        />
      </View>
    </Screen>
  );
};

export default RequestSentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    justifyContent: 'center',
  },
  titleText: {
    fontWeight: 'bold',
    textAlign: 'center',
    ...fontSize.xlarge,
    alignSelf: 'center',
    marginTop: '10%',
  },
  detailsTitleText: {
    marginTop: '10%',
    ...fontSize.mlarge,
    fontWeight: 'bold',
  },
  paragraphText: {
    fontWeight: 'bold',
    ...fontSize.big,
  },
});
