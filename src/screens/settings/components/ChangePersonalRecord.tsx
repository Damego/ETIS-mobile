import { useNavigation } from '@react-navigation/native';
import React from 'react';

import ClickableText from '~/components/ClickableText';
import { ServicesNavigationProp } from '~/navigation/types';
import { fontSize } from '~/utils/texts';

export default function ChangePersonalRecord() {
  const navigation = useNavigation<ServicesNavigationProp>();

  return (
    <ClickableText
      text={'Сменить личную запись'}
      onPress={() => navigation.navigate('PersonalRecords')}
      textStyle={[fontSize.medium, { fontWeight: '500' }]}
      colorVariant={'block'}
    />
  );
}
