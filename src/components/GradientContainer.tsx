import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';

import HalloweenEmoji from './HalloweenEmoji';

const GradientContainer = ({
  disabled,
  colors,
  children,
}: {
  disabled: boolean;
  colors: string[];
  children: React.ReactNode;
}) => {
  if (disabled) return children;

  return (
    <LinearGradient colors={colors} style={{ flex: 1 }}>
      {/* TODO: Remove after halloween */}
      <HalloweenEmoji />
      {children}
    </LinearGradient>
  );
};

export default GradientContainer;
