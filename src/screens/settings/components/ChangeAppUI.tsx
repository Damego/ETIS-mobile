import { useNavigation } from '@react-navigation/native';
import React from 'react';

import Card from '~/components/Card';
import ClickableText from '~/components/ClickableText';
import { ServicesNavigationProp } from '~/navigation/types';
import { fontSize } from '~/utils/texts';

const ChangeAppUI = () => {
  const navigation = useNavigation<ServicesNavigationProp>();

  const onPress = () => {
    navigation.navigate('ChangeAppUI');
  };

  return (
    <Card>
      <ClickableText
        text={'Настройки интерфейса'}
        onPress={onPress}
        textStyle={[fontSize.medium, { fontWeight: '500' }]}
      />
    </Card>
  );
};

export default ChangeAppUI;
