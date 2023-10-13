import { useColorScheme } from 'react-native';

import { ThemeType } from '../redux/reducers/settingsSlice';
import { APP_THEMES } from '../styles/themes';
import { useAppSelector } from './redux';

export const useAppColorScheme = () => {
  const themeType = useAppSelector((state) => state.settings.theme);
  const scheme = useColorScheme();

  if (themeType !== ThemeType.auto) return themeType;

  return ThemeType[scheme];
};

export const useAppTheme = () => {
  const scheme = useAppColorScheme();
  return APP_THEMES[scheme];
};
