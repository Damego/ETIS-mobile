import React from 'react';
import { StyleSheet, View } from 'react-native';

import CenteredText from '~/components/CenteredText';
import Text from '~/components/Text';
import { borderRadius } from '~/utils/texts';
import { getRandomItem } from '~/utils/utils';

const noPairsResponses = [
  'Можно поиграть 🎮',
  'Можно поспать 💤',
  'Можно отдохнуть 😴',
  'Нужно сделать домашку 📚',
];

const NoPairs = () => (
  <View style={styles.view}>
    <CenteredText>В этот день занятий нет</CenteredText>
    <Text>{getRandomItem(noPairsResponses)}</Text>
  </View>
);

export default NoPairs;

const styles = StyleSheet.create({
  view: {
    width: '90%',
    alignSelf: 'center',
    marginTop: '4%',
    paddingVertical: '2%',
    borderRadius: borderRadius.medium,
    alignItems: 'center',
  },
});
