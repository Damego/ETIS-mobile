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
    elevation: 4,
  },
  buttonNavigator: {
    tabBarStyle: { zIndex: 1 },
  },
  loadingDataText: {
    fontSize: 30,
  },

  lessonContainer: {
    marginLeft: '1%',
    display: 'flex',
    marginTop: '1%',
    marginBottom: '1%',
    flexWrap: 'wrap',
    flexShrink: 1,

    paddingHorizontal: '1%',
  },
  lessonTimeView: {
    paddingHorizontal: 1,
  },
  lessonTimeText: {
    fontSize: 14,
  },
  lessonInfoView: {},
  lessonInfoText: {
    fontSize: 16,
    fontWeight: '500',
  },
  lessonAudienceText: {
    color: '#353535',
  },
  textIcon: {
    marginBottom: '5%',
    fontSize: 10,
  },
});
