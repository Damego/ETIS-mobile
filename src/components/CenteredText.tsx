import React from 'react';
import { StyleSheet, View } from 'react-native';

import { fontSize } from '~/utils/texts';
import Text from './Text';

const CenteredText = ({ children }: { children: string }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{children}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontWeight: '500',
    ...fontSize.large,
  },
});

export default CenteredText;
