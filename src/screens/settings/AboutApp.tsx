import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

import { useGlobalStyles } from '../../hooks';
import { fontSize } from '../../utils/texts';

const AboutAppButton = () => {
  const navigation = useNavigation();
  const globalStyles = useGlobalStyles();

  return (
    <TouchableOpacity onPress={() => navigation.navigate('О приложении')} activeOpacity={0.9}>
      <Text style={[fontSize.medium, { fontWeight: '500' }, globalStyles.textColor]}>
        О приложении
      </Text>
    </TouchableOpacity>
  );
};

export default AboutAppButton;
