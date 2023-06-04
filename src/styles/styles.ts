import { StyleSheet } from 'react-native';

const getGlobalStyles = ({ colors }) =>
  StyleSheet.create({
    shadow: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: 0.35,
      shadowRadius: 6,
      elevation: 5,
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
    block: {
      backgroundColor: colors.block,
    },
    textColor: {
      color: colors.text,
    },
  });

export default getGlobalStyles;
