import { StyleSheet } from 'react-native';

import { IThemeColors } from './themes';

const getGlobalStyles = ({ colors }: { colors: IThemeColors }) =>
  StyleSheet.create({
    shadow: {
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: 0.35,
      shadowRadius: 6,
      elevation: 5,
    },
    borderRadius: {
      borderRadius: 10,
    },
    border: {
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.border,
    },
    primaryFontColor: {
      color: colors.primary,
    },
    primaryBackgroundColor: {
      backgroundColor: colors.primary,
    },
    fontColorForPrimary: {
      color: colors.textForPrimary,
    },
    fontColorForSecondary: {
      color: colors.textForSecondary,
    },
    secondaryFontColor: {
      color: colors.secondary,
    },
    secondaryBackgroundColor: {
      backgroundColor: colors.secondary,
    },
    block: {
      backgroundColor: colors.block,
    },
    textColor: {
      color: colors.text,
    },
  });

export default getGlobalStyles;
