import React, { useState } from 'react';
import { StyleSheet, Text, ToastAndroid, TouchableOpacity } from 'react-native';

import CardHeaderIn from '../../components/CardHeaderIn';
import { useGlobalStyles } from '../../hooks';
import { ICertificate } from '../../models/ICertificate';
import { cutCertificateHTML } from '../../parser/certificate';
import { httpClient } from '../../utils';
import { fontSize } from '../../utils/texts';
import CertificateModal from './CertificateModal';

const styles = StyleSheet.create({
  fontW500: {
    fontWeight: '500',
  },
});

const Certificate = ({
  certificate,
  updateData,
}: {
  certificate: ICertificate;
  updateData: (certificate: ICertificate) => void;
}) => {
  const globalStyles = useGlobalStyles();

  const [isOpened, setOpened] = useState<boolean>(false);
  const [html, setHTML] = useState<string>();

  const closeModal = () => setOpened(false);

  const openModal = () => {
    if (certificate.example) {
      setHTML(certificate.example);
      setOpened(true);
    } else
      httpClient.getCertificateHTML(certificate).then((certificateHTML) => {
        const preparedHTML = cutCertificateHTML(certificateHTML);
        if (!preparedHTML) {
          ToastAndroid.show('Произошла ошибка...', ToastAndroid.LONG);
          return;
        }
        const newCert = certificate;
        newCert.example = preparedHTML;
        updateData(newCert);
        setHTML(preparedHTML);
        setOpened(true);
      });
  };

  return (
    <>
      {isOpened && <CertificateModal html={html} closeModal={closeModal} />}

      <TouchableOpacity onPress={openModal}>
        <CardHeaderIn topText={`№${certificate.id ?? '-'} от ${certificate.date}`}>
          <Text style={[fontSize.small, styles.fontW500, globalStyles.textColor]}>
            {certificate.name} статус: {certificate.status}
          </Text>
        </CardHeaderIn>
      </TouchableOpacity>
    </>
  );
};

export default Certificate;
