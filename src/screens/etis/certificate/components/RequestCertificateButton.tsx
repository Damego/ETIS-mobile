import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import Card from '~/components/Card';
import Text from '~/components/Text';
import { useGlobalStyles } from '~/hooks';
import { IAvailableCertificate } from '~/models/certificate';
import { EducationNavigationProp } from '~/navigation/types';
import { fontSize } from '~/utils/texts';

export const iconSize = 24;

export const RequestCertificateButton = ({
  availableCertificates,
}: {
  availableCertificates: IAvailableCertificate[];
}) => {
  const globalStyles = useGlobalStyles();
  const navigation = useNavigation<EducationNavigationProp>();

  return (
    <Card>
      <TouchableOpacity
        onPress={() => navigation.navigate('RequestCertificate', availableCertificates)}
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
