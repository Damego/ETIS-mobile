import { StyleSheet } from 'react-native';

export const GLOBAL_STYLES = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 3,
  },
  loadingDataText: {
    fontSize: 30,
  },
  textIcon: {
    marginBottom: '5%',
    fontSize: 10,
  },
  textTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: '2%',
  },
});
