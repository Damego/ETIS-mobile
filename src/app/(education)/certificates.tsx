import { AntDesign } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import BorderLine from '~/components/BorderLine';
import LoadingScreen from '~/components/LoadingScreen';
import NoData from '~/components/NoData';
import Screen from '~/components/Screen';
import { useClient } from '~/data/client';
import { useGlobalStyles } from '~/hooks';
import useQuery from '~/hooks/useQuery';
import { ButtonWithPopover } from '~/screens/etis/certificate/components/ButtonWithPopover';
import CertificateCard from '~/screens/etis/certificate/components/CertificateCard';
import {
  RequestCertificateButton,
  iconSize,
} from '~/screens/etis/certificate/components/RequestCertificateButton';
import { fontSize } from '~/utils/texts';

const CertificateTable = () => {
  const client = useClient();
  const { data, isLoading, refresh } = useQuery({
    method: client.getCertificateData,
  });
  const globalStyles = useGlobalStyles();

  useFocusEffect(
    useCallback(() => {
      // Если пользователь закажет справку, то список не обновится при возврате на этот экран
      if (!isLoading) refresh();
    }, [isLoading, refresh])
  );

  if (isLoading) return <LoadingScreen onRefresh={refresh} />;
  if (!data) return <NoData />;

  return (
    <Screen onUpdate={refresh} containerStyle={{ gap: 8 }}>
      {data.announce.header && (
        <>
          <ButtonWithPopover
            title="Объявление"
            info={data.announce.header}
            textStyle={[styles.announceButtonText, fontSize.large, globalStyles.primaryText]}
          />

          <BorderLine />
        </>
      )}

      {data.announce.footer && (
        <>
          <RequestCertificateButton availableCertificates={data.availableCertificates} />
          <ButtonWithPopover
            title="Сроки и выдача справок"
            info={data.announce.footer}
            textStyle={[fontSize.medium, { fontWeight: 'bold' }]}
            icon={
              <AntDesign
                name="infocirlceo"
                size={iconSize}
                color={globalStyles.textColor.color}
                style={{ marginRight: '2%' }}
              />
            }
          />
          <BorderLine />
        </>
      )}

      {data.certificates?.map((certificate, index) => (
        <CertificateCard key={index} certificate={certificate} />
      ))}
    </Screen>
  );
};

export default CertificateTable;

const styles = StyleSheet.create({
  announceButtonText: { fontWeight: 'bold' },
});
