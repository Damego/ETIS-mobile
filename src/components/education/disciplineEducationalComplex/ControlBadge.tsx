import React from 'react';
import { StyleSheet, View } from 'react-native';
import Text from '~/components/Text';
import { useGlobalStyles } from '~/hooks';

export const ControlBadge = () => {
  const globalStyles = useGlobalStyles();

  return (
    <View style={[controlBadgeStyles.view, globalStyles.primaryBackgroundColor]}>
      <Text style={[controlBadgeStyles.text, globalStyles.primaryContrastText]}>Контроль</Text>
    </View>
  );
};
const controlBadgeStyles = StyleSheet.create({
  view: {
    borderRadius: 5,
    paddingHorizontal: '1%',
    paddingVertical: '0.5%',
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
  },
});
