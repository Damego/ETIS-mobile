import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useGlobalStyles } from '../../hooks';
import { fontSize } from '../../utils/texts';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '25%',
  },
  topText: {
    fontWeight: '600',
  },
  bottomText: {
    fontWeight: '600',
  },
});

export default function RightText({
  topText,
  bottomText,
}: {
  topText: React.ReactNode;
  bottomText: React.ReactNode;
}) {
  const globalStyles = useGlobalStyles();

  return (
    <View style={styles.container}>
      <Text style={[fontSize.xxlarge, styles.topText]}>{topText}</Text>
      <Text style={[fontSize.medium, styles.bottomText, globalStyles.textColor]}>{bottomText}</Text>
    </View>
  );
}
