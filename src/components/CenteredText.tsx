import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useGlobalStyles } from '../hooks';
import { fontSize } from '../utils/texts';

const CenteredText = ({ children }: { children: string }) => {
  const globalStyles = useGlobalStyles();

  return (
    <View style={styles.container}>
      <Text style={[globalStyles.textColor, fontSize.large, styles.text]}>{children}</Text>
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
  },
});

export default CenteredText;
