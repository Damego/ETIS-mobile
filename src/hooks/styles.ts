import { useTheme } from '@react-navigation/native';
import { useMemo } from 'react';

import getGlobalStyles from '../styles';

function useGlobalStyles() {
  const { colors } = useTheme();
  return useMemo(() => getGlobalStyles({ colors }), [colors]);
}

export default useGlobalStyles;
