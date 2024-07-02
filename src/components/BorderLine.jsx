import React from 'react';
import { View } from 'react-native';
import { useAppTheme } from '~/hooks/theme';

const BorderLine = () => {
  const theme = useAppTheme();

  return (
    <View
      style={{
        borderBottomColor: theme.colors.border,
        borderBottomWidth: 1,
        alignSelf: 'center',
        width: '95%',
        marginVertical: '2%',
      }}
    />
  );
};

export default BorderLine;
