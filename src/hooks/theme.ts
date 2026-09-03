import { DefaultTheme } from '@react-navigation/native';
import { useColorScheme } from 'react-native';

import { APP_THEMES, ITheme, ThemeType } from '../styles/themes';
import { useAppSelector } from './redux';

export const useAppTheme = (): ITheme => {
  const themeType = useAppSelector((state) => state.settings.config.theme) ?? ThemeType.light;
  const scheme = useColorScheme() ?? 'light';

  if (themeType === ThemeType.auto) {
    const theme = (APP_THEMES as Record<string, ITheme | undefined>)[scheme];
    return (theme ?? DefaultTheme) as unknown as ITheme;
  }

  const theme = APP_THEMES[themeType];
  if (!theme) return DefaultTheme as unknown as ITheme;
  if ((theme as any).light && (theme as any).dark) {
    return ((theme as any)[scheme] ?? DefaultTheme) as unknown as ITheme;
  }
  return theme;
};
