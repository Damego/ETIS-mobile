import { useColorScheme } from 'react-native';

import { ThemeType } from '../redux/reducers/settingsSlice';
import { BlackTheme, DarkTheme, ITheme, LightTheme } from '../styles/themes';
import { useAppSelector } from './redux';

export const useAppColorScheme = () => {
  const themeType = useAppSelector((state) => state.settings.theme);
  const scheme = useColorScheme();

  if (themeType !== ThemeType.auto) return themeType;

  return ThemeType[scheme];
};

export const useAppTheme = () => {
  const scheme = useAppColorScheme();
  let theme: ITheme;
  if (scheme === 'dark') {
    theme = DarkTheme;
  } else if (scheme === 'black') {
    theme = BlackTheme;
  } else {
    theme = LightTheme;
  }

  return theme;
};
