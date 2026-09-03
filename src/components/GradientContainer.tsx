import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';

// Градиентный фон событийных тем (см. ITheme.backgroundGradient).
// Вызывается только при наличии градиента — пустой вызов не нужен
const GradientContainer = ({ colors }: { colors?: string[] }) => {
  if (!colors) return null;

  return <LinearGradient colors={colors as [string, string, ...string[]]} style={{ flex: 1 }} />;
};

export default GradientContainer;
