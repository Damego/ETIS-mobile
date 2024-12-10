import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import Card from '~/components/Card';
import Text from '~/components/Text';
import { useGlobalStyles } from '~/hooks';
import useAppRouter from '~/hooks/useAppRouter';
import { IAvailableCertificate } from '~/models/certificate';
import { fontSize } from '~/utils/texts';

export const iconSize = 24;

export const RequestCertificateButton = ({
  availableCertificates,
}: {
  availableCertificates: IAvailableCertificate[];
}) => {
  const globalStyles = useGlobalStyles();
  const router = useAppRouter();

  const handlePress = () => {
    router.push('requestCertificate', { payload: availableCertificates });
  };

  return (
    <Card>
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.9}
        style={{ flexDirection: 'row', paddingVertical: '2%', alignItems: 'center' }}
      >
        <AntDesign
          name="plus"
          size={iconSize}
          color={globalStyles.textColor.color}
          style={{ marginRight: '2%' }}
        />
        <Text style={[fontSize.medium, { fontWeight: 'bold' }]}>Заказать справку</Text>
      </TouchableOpacity>
    </Card>
  );
};
