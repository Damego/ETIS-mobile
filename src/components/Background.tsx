import { ImageBackground } from 'expo-image';
import React from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';

import { ITheme } from '~/styles/themes';

import GradientContainer from './GradientContainer';
import { HalloweenDecoration } from './HalloweenDecoration';

const AbsoluteBackground = ({
  height,
  width,
  children,
}: {
  height: number;
  width: number;
  children: React.ReactNode;
}) => (
  <View style={[styles.absoluteContainer, { height, width }]}>{children}</View>
);

// Рендерит слои фона событийных тем (градиент, картинка, декорации)
// под основным контентом экрана. Для обычных тем ничего не рисует.
const Background = ({ theme, children }: { theme: ITheme; children: React.ReactNode }) => {
  // Размеры берутся хуком, а не Dimensions.get на уровне модуля:
  // модульный вызов фиксирует значения при загрузке бандла и не
  // переживает повороты/изменения окна (планшеты, split screen)
  const { height, width } = useWindowDimensions();

  return (
    <>
      {Boolean(theme.backgroundGradient) && (
        <AbsoluteBackground height={height} width={width}>
          <GradientContainer colors={theme.backgroundGradient} />
        </AbsoluteBackground>
      )}
      {Boolean(theme.backgroundImage) && (
        <AbsoluteBackground height={height} width={width}>
          <ImageBackground source={theme.backgroundImage} style={{ flex: 1 }} />
        </AbsoluteBackground>
      )}
      <AbsoluteBackground height={height} width={width}>
        <HalloweenDecoration />
      </AbsoluteBackground>
      {children}
    </>
  );
};

export default Background;

const styles = StyleSheet.create({
  absoluteContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});
