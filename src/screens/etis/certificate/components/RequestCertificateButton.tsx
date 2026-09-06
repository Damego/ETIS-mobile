import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity } from 'react-native';

import Card from '~/components/Card';
import Text from '~/components/Text';
import { useGlobalStyles } from '~/hooks';
import { IAvailableCertificate } from '~/models/certificate';
import { EducationNavigationProp } from '~/navigation/types';
import { fontSize, iconSize } from '~/utils/texts';

export const RequestCertificateButton = ({
  availableCertificates,
}: {
  readonly availableCertificates: IAvailableCertificate[];
}) => {
  const { t } = useTranslation();
  const globalStyles = useGlobalStyles();
  const navigation = useNavigation<EducationNavigationProp>();

  return (
    <Card>
      <TouchableOpacity
        activeOpacity={0.9}
        style={{ flexDirection: 'row', paddingVertical: '2%', alignItems: 'center' }}
        onPress={() => navigation.navigate('RequestCertificate', availableCertificates)}
      >
        <AntDesign
          name='plus'
          size={iconSize.medium}
          color={globalStyles.textColor.color}
          style={{ marginRight: '2%' }}
        />
        <Text style={[fontSize.medium, { fontWeight: 'bold' }]}>
          {t('certificate.orderButton')}
        </Text>
      </TouchableOpacity>
    </Card>
  );
};
