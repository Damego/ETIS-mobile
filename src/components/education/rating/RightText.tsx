import React from 'react';
import { StyleSheet, View } from 'react-native';
import Text from '~/components/Text';
import { fontSize } from '~/utils/texts';

const RightText = ({
  topText,
  bottomText,
}: {
  topText: React.ReactNode;
  bottomText: React.ReactNode;
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.topText}>{topText}</Text>
      <Text style={styles.bottomText}>{bottomText}</Text>
    </View>
  );
};

export default RightText;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '25%',
  },
  topText: {
    fontWeight: '600',
    ...fontSize.xxlarge,
  },
  bottomText: {
    fontWeight: '600',
    ...fontSize.medium,
  },
});
