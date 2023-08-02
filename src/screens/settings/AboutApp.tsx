import { useNavigation } from '@react-navigation/native';
import React from 'react';

import ClickableText from '../../components/ClickableText';
import { useGlobalStyles } from '../../hooks';
import { fontSize } from '../../utils/texts';

const AboutAppButton = () => {
  const navigation = useNavigation();
  const globalStyles = useGlobalStyles();

  return (
    <ClickableText
      text={'О приложении'}
      onPress={() => navigation.navigate('AboutApp')}
      textStyle={[fontSize.medium, { fontWeight: '500' }, globalStyles.textColor]}
    />
  );
};

export default AboutAppButton;
