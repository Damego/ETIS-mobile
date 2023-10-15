import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useAppSelector } from '../hooks';
import { ThemeType } from '../redux/reducers/settingsSlice';
import { isHalloween } from '../utils/events';
import { getRandomItem } from '../utils/utils';

const EMOJI = ['🎃', '👻', '🕷', '🕸'];

const emojiStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 10,
    top: 10,
    transform: [{ rotate: '40deg' }],
  },
  text: {
    fontSize: 200,
    opacity: 0.3
  },
});

const HalloweenEmoji = () => {
  const { theme } = useAppSelector((state) => state.settings);

  if (!isHalloween() || theme !== ThemeType.halloween) return;

  return (
    <View style={emojiStyles.container}>
      <Text style={emojiStyles.text}>{getRandomItem(EMOJI)}</Text>
    </View>
  );
};

export default HalloweenEmoji;
