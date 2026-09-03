import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useAppSelector } from '../hooks';
import { ThemeType } from '../styles/themes';
import { getRandomItem } from '../utils/utils';

const EMOJI = ['🎃', '👻', '🕷', '🕸'];

const emojiStyles = StyleSheet.create({
  topContainer: {
    position: 'absolute',
    right: 10,
    top: 10,
    transform: [{ rotate: '40deg' }],
  },
  bottomContainer: {
    position: 'absolute',
    left: 10,
    bottom: 10,
    transform: [{ rotate: '320deg' }],
  },
  bigEmoji: {
    fontSize: 200,
    opacity: 0.3,
  },
  littleEmoji: {
    fontSize: 100,
    opacity: 0.3,
  },
});

export const HalloweenEmoji = () => (
  <Text style={emojiStyles.littleEmoji}>{getRandomItem(EMOJI)}</Text>
);

export const HalloweenDecoration = () => {
  const { theme } = useAppSelector((state) => state.settings.config);

  // Эмодзи фиксированы на монтирование, а не перебрасываются
  // при каждом ре-рендере (redux-апдейты не должны их менять)
  const [topEmoji, bottomEmoji] = React.useMemo(
    () => [getRandomItem(EMOJI), getRandomItem(EMOJI)],
    []
  );

  if (theme !== ThemeType.halloween) return;

  return (
    <>
      <View style={emojiStyles.topContainer}>
        <Text style={emojiStyles.bigEmoji}>{topEmoji}</Text>
      </View>
      <View style={emojiStyles.bottomContainer}>
        <Text style={emojiStyles.bigEmoji}>{bottomEmoji}</Text>
      </View>
    </>
  );
};
