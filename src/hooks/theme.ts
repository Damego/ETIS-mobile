import { useColorScheme } from 'react-native';

import { ThemeType } from '../redux/reducers/settingsSlice';
import { useAppSelector } from './redux';
import { AmoledTheme, DarkTheme, ITheme, LightTheme } from '../styles/themes';

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
  } else if (scheme === 'amoled') {
    theme = AmoledTheme;
  } else {
    theme = LightTheme;
  }

  return theme;
}