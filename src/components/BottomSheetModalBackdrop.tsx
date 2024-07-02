import { BottomSheetBackdropProps as GorhomBottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import React, { useMemo } from 'react';
import { Pressable } from 'react-native';
import Animated, { Extrapolation, interpolate, useAnimatedStyle } from 'react-native-reanimated';

export interface BottomSheetBackdropProps extends GorhomBottomSheetBackdropProps {
  onPress: () => void;
}

const BottomSheetModalBackdrop = ({ animatedIndex, style, onPress }: BottomSheetBackdropProps) => {
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(animatedIndex.value, [-1, 0], [0, 0.3], Extrapolation.CLAMP),
  }));

  const containerStyle = useMemo(
    () => [
      style,
      {
        backgroundColor: '#000000',
      },
      containerAnimatedStyle,
    ],
    [style, containerAnimatedStyle]
  );

  return (
    <Animated.View style={containerStyle}>
      <Pressable style={{ flex: 1 }} onPress={onPress} />
    </Animated.View>
  );
};

export default BottomSheetModalBackdrop;
