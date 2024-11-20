import { StyleSheet } from 'react-native';

import { IThemeColors } from './themes';

const getGlobalStyles = ({ colors }: { colors: IThemeColors }) =>
  StyleSheet.create({
    background: {
      backgroundColor: colors.background,
    },
    containerBackground: {
      backgroundColor: colors.container,
    },
    container: {
      borderRadius: 20,
      backgroundColor: colors.container,
    },
    card: {
      backgroundColor: colors.cards,
      borderRadius: 10,
    },
    borderRadius: {
      borderRadius: 10,
    },
    border: {
      borderRadius: 10,
      borderWidth: 2,
      borderColor: colors.border,
    },
    primaryBorder: {
      borderRadius: 10,
      borderWidth: 2,
      borderColor: colors.primary,
    },
    invisibleBorder: {
      borderWidth: 2,
      borderColor: colors.background,
    },
    primaryText: {
      color: colors.primary,
    },
    primaryBackgroundColor: {
      backgroundColor: colors.primary,
    },
    secondaryText: {
      color: colors.secondary,
    },
    secondaryBackgroundColor: {
      backgroundColor: colors.secondary,
    },
    textColor: {
      color: colors.text,
    },
    textColor2: {
      color: colors.text2,
    },
    primaryContrastText: {
      color: colors.primaryContrast,
    },
    secondaryContrastText: {
      color: colors.secondaryContrast,
    },
    inputPlaceholder: {
      color: colors.inputPlaceholder,
    },
  });

export default getGlobalStyles;
