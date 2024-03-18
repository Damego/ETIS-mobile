import { useColorScheme } from 'react-native';

import { APP_THEMES, ITheme, ThemeType } from '../styles/themes';
import { useAppSelector } from './redux';

export const useAppTheme = (): ITheme => {
  const themeType = useAppSelector((state) => state.settings.config.theme);
  const scheme = useColorScheme();

  if (themeType === ThemeType.auto) {
    return APP_THEMES[scheme];
  }

  const theme = APP_THEMES[themeType];
  if (theme.light && theme.dark) {
    return theme[scheme];
  }

  return theme;
};
