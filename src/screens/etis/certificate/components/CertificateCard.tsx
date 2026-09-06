import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, ToastAndroid, TouchableOpacity } from 'react-native';

import { cache } from '~/cache/smartCache';
import CardHeaderIn from '~/components/CardHeaderIn';
import Text from '~/components/Text';
import { ICertificate } from '~/models/certificate';
import { cutCertificateHTML } from '~/parser/certificate';
import { httpClient } from '~/utils';
import { fontSize } from '~/utils/texts';

import CertificateModal from './CertificateModal';

const CertificateCard = ({ certificate }: { readonly certificate: ICertificate }) => {
  const { t } = useTranslation();
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
      ToastAndroid.show(t('common.error'), ToastAndroid.LONG);
      return;
    }
    setHTML($html);
    setOpened(true);
  };

  return (
    <>
      {isOpened ? <CertificateModal html={html ?? ''} closeModal={closeModal} /> : null}

      <TouchableOpacity onPress={openModal}>
        <CardHeaderIn
          topText={t('certificate.numberDate', {
            id: certificate.id ?? '-',
            date: certificate.date,
          })}
        >
          <Text style={styles.textTitle}>
            {t('certificate.statusLine', {
              name: certificate.name,
              status: certificate.status,
            })}
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
