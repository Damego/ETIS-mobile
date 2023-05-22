import {useMemo} from 'react';

import { StyleSheet } from "react-native";
import { useTheme } from '@react-navigation/native'

const getGlobalStyles = ({ colors }) => StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 1,
  },
  border: {
    borderRadius: 10,
  },
  primaryFontColor: {
    color: colors.primary
  },
  primaryBackgroundColor: {
    backgroundColor: colors.primary
  }
});

function useGlobalStyles() {
  const { colors } = useTheme();
  return useMemo(() => getGlobalStyles({ colors }), [colors]);

}

export default useGlobalStyles;