import { useNavigation } from '@react-navigation/native';
import React from 'react';

import Card from '../../../components/Card';
import ClickableText from '../../../components/ClickableText';
import { ServicesNavigationProp } from '../../../navigation/types';
import { fontSize } from '../../../utils/texts';

export default function ChangePasswordSetting() {
  const navigation = useNavigation<ServicesNavigationProp>();

  return (
    <Card>
      <ClickableText
        text={'Сменить пароль'}
        onPress={() => navigation.navigate('ChangePassword')}
        textStyle={[fontSize.medium, { fontWeight: '500' }]}
        colorVariant={'block'}
      />
    </Card>
  );
}
