import { ImageBackground } from 'expo-image';
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';

import { ITheme } from '~/styles/themes';

import GradientContainer from './GradientContainer';
import { HalloweenDecoration } from './HalloweenDecoration';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('screen');

const AbsoluteBackground = ({ children }: { children: React.ReactNode }) => (
  <View style={styles.absoluteContainer}>{children}</View>
);

// Рендерит слои фона событийных тем (градиент, картинка, декорации)
// под основным контентом экрана. Для обычных тем ничего не рисует.
const Background = ({ theme, children }: { theme: ITheme; children: React.ReactNode }) => (
  <>
    {Boolean(theme.backgroundGradient) && (
      <AbsoluteBackground>
        <GradientContainer colors={theme.backgroundGradient} />
      </AbsoluteBackground>
    )}
    {Boolean(theme.backgroundImage) && (
      <AbsoluteBackground>
        <ImageBackground source={theme.backgroundImage} style={{ flex: 1 }} />
      </AbsoluteBackground>
    )}
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
