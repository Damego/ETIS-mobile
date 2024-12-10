import React, { useState } from 'react';
import { StyleSheet, ToastAndroid, TouchableOpacity } from 'react-native';
import { cache } from '~/cache/smartCache';
import CardHeaderIn from '~/components/CardHeaderIn';
import Text from '~/components/Text';
import { ICertificate } from '~/models/certificate';
import { cutCertificateHTML } from '~/parser/certificate';
import { httpClient } from '~/utils';
import { fontSize } from '~/utils/texts';

import CertificateModal from './CertificateModal';

const CertificateCard = ({ certificate }: { certificate: ICertificate }) => {
  const [isOpened, setOpened] = useState<boolean>(false);
  const [html, setHTML] = useState<string>();

  const getCertificate = async () => {
    if (certificate.example) return certificate.example;

    const response = await httpClient.getCertificateHTML(certificate);
    if (!response.data) return;

    const $html = cutCertificateHTML(response.data);
    if (!$html) return;

    certificate.example = $html;
    cache.placeOneCertificate(certificate);
    return certificate.example;
  };

  const closeModal = () => setOpened(false);

  const openModal = async () => {
    const $html = await getCertificate();
    if (!$html) {
      ToastAndroid.show('Ошибка', ToastAndroid.LONG);
      return;
    }
    setHTML($html);
    setOpened(true);
  };

  return (
    <>
      {isOpened && <CertificateModal html={html} closeModal={closeModal} />}

      <TouchableOpacity onPress={openModal}>
        <CardHeaderIn topText={`№${certificate.id ?? '-'} от ${certificate.date}`}>
          <Text style={styles.textTitle}>
            {certificate.name} статус: {certificate.status}
          </Text>
        </CardHeaderIn>
      </TouchableOpacity>
    </>
  );
};

export default CertificateCard;

const styles = StyleSheet.create({
  textTitle: {
    fontWeight: '500',
    ...fontSize.small,
  },
});
