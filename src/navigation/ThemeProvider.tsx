import { ThemeProvider as RNThemeProvider } from '@react-navigation/native';
import { setBackgroundColorAsync as setBackgroundNavigationBarColorAsync } from 'expo-navigation-bar';
import { StatusBar } from 'expo-status-bar';
import { setBackgroundColorAsync } from 'expo-system-ui';
import React, { useEffect } from 'react';
import { useAppTheme } from '~/hooks/theme';

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const theme = useAppTheme();

  useEffect(() => {
    setBackgroundNavigationBarColorAsync(theme.colors.card).catch((e) => e);
    setBackgroundColorAsync(theme.colors.background).catch((e) => e);
  }, [theme]);

  return (
    <RNThemeProvider value={theme}>
      <StatusBar style={theme.statusBarStyle} />
      {children}
    </RNThemeProvider>
  );
};

export default ThemeProvider;
