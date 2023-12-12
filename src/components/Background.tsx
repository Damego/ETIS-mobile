import { ImageBackground } from 'expo-image';
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';

import GradientContainer from './GradientContainer';
import { HalloweenDecoration } from './HalloweenDecoration';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('screen');

const AbsoluteBackground = ({ children }) => (
  <View style={styles.absoluteContainer}>{children}</View>
);

const Background = ({ theme, children }) => (
  <>
    <AbsoluteBackground>
      <GradientContainer
        disabled={!theme.colors.backgroundGradient}
        colors={theme.colors.backgroundGradient}
      />
    </AbsoluteBackground>
    <AbsoluteBackground>
      <ImageBackground source={theme.backgroundImage} style={{ flex: 1 }} />
    </AbsoluteBackground>
    <AbsoluteBackground>
      <HalloweenDecoration />
    </AbsoluteBackground>
    {children}
  </>
);

export default Background;

const styles = StyleSheet.create({
  absoluteContainer: {
    position: 'absolute',
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH,
  },
});
