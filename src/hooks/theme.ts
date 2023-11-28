import { useColorScheme } from 'react-native';

import { APP_THEMES, ThemeType } from '../styles/themes';
import { useAppSelector } from './redux';

export const useAppColorScheme = () => {
  const themeType = useAppSelector((state) => state.settings.theme);
  const scheme = useColorScheme();

  if (themeType === ThemeType.winter) {
    if (scheme === 'light') return ThemeType.lightWinter
    return ThemeType.darkWinter;
  }

  if (themeType !== ThemeType.auto) return themeType;

  return ThemeType[scheme];
};

export const useAppTheme = () => {
  const scheme = useAppColorScheme();
  return APP_THEMES[scheme];
};
