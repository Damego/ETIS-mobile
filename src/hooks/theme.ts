import { ThemeType } from '../redux/reducers/settingsSlice';
import { useAppSelector } from './redux';
import { useColorScheme } from 'react-native';

export const useAppColorScheme = () => {
  const themeType = useAppSelector(state => state.settings.theme);
  const scheme = useColorScheme();

  if (themeType !== ThemeType.auto) return themeType;

  return ThemeType[scheme];
}