import { useNavigation } from '@react-navigation/native';
import React from 'react';

import ClickableText from '../../components/ClickableText';
import { ServicesNavigationProp } from '../../navigation/types';
import { fontSize } from '../../utils/texts';

const AboutAppButton = () => {
  const navigation = useNavigation<ServicesNavigationProp>();

  return (
    <ClickableText
      text={'О приложении'}
      onPress={() => navigation.navigate('AboutApp')}
      textStyle={[fontSize.medium, { fontWeight: '500' }]}
      colorVariant={'block'}
    />
  );
};

export default AboutAppButton;
