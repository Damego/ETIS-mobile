import React from 'react';
import { View } from 'react-native';
import { useGlobalStyles } from '../hooks';

const BorderLine = () => {
  const globalStyles = useGlobalStyles();

  return (
    <View
      style={{
        borderBottomColor: globalStyles.border.borderColor,
        borderBottomWidth: 1,
        alignSelf: 'center',
        width: '95%',
        marginVertical: '2%'
      }}
    />
  );
}

export default BorderLine;
