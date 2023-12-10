import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';


const GradientContainer = ({
  disabled,
  colors,
}: {
  disabled: boolean;
  colors: string[];
}) => {
  if (disabled) return;

  return (
    <LinearGradient colors={colors} style={{ flex: 1 }} />
  );
};

export default GradientContainer;
