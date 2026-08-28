import { useMemo } from 'react';

import getGlobalStyles from '../styles';
import { IThemeColors } from '../styles/themes';
import { useAppTheme } from './theme';

function useGlobalStyles() {
  const { colors } = useAppTheme();
  return useMemo(() => getGlobalStyles({ colors: colors }), [colors]);
}

export default useGlobalStyles;
