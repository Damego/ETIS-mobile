import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from '~/components/Button';
import Card from '~/components/Card';
import Screen from '~/components/Screen';
import Text from '~/components/Text';
import { CertificateRequest } from '~/models/certificateRequest';
import { DELIVERY_METHODS, KNOWN_CERTIFICATES } from '~/screens/etis/certificate/data';
import { fontSize } from '~/utils/texts';

const RequestSentScreen = ({
  certificateId,
  note,
  quantity,
  delivery,
  place,
}: CertificateRequest) => {
  const navigation = useNavigation();

  const certificateName = KNOWN_CERTIFICATES.find((cert) => cert.id === certificateId).name;
  const deliveryMethodName = DELIVERY_METHODS.find((method) => method.id === delivery).name;

  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.titleText}>Справка заказана!</Text>

        <Text style={styles.detailsTitleText}>Детали</Text>

        <Card>
          <Text style={styles.paragraphText}>Название</Text>
          <Text style={fontSize.big}>{certificateName}</Text>

          <Text style={styles.paragraphText}>Количество</Text>
          <Text style={fontSize.big}>{quantity} шт.</Text>

          {note && (
            <>
              <Text style={styles.paragraphText}>Примечание</Text>
              <Text style={fontSize.big}>{note}</Text>
            </>
          )}

          <Text style={styles.paragraphText}>Метод вручения</Text>
          <Text style={fontSize.big}>{deliveryMethodName}</Text>

          {place && (
            <>
              <Text style={styles.paragraphText}>
                Место предъявления (организация-работодатель)
              </Text>
              <Text style={fontSize.big}>{place}</Text>
            </>
          )}
        </Card>
      </View>

      <View style={{ bottom: '1%' }}>
        <Button text={'Вернуться назад'} onPress={() => navigation.goBack()} variant={'primary'} />
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
