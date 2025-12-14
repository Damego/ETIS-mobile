import { useColorScheme } from 'react-native';

import { APP_THEMES, ITheme, ThemeType } from '../styles/themes';
import { useAppSelector } from './redux';
import { DefaultTheme } from '@react-navigation/native';

export const useAppTheme = (): ITheme => {
  const themeType = useAppSelector((state) => state.settings.config.theme) ?? ThemeType.light;
  const scheme = useColorScheme() ?? 'light';

  if (themeType === ThemeType.auto) {
    return APP_THEMES[scheme] ?? DefaultTheme;
  }

  const theme = APP_THEMES[themeType];
  if (!theme) return DefaultTheme;
  if ((theme as any).light && (theme as any).dark) {
    return (theme as any)[scheme] ?? DefaultTheme;
  }
  return theme;
};
