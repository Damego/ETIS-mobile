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
  loadingDataText: {
    fontSize: 30,
  },
  lessonContainer: {
    display: 'flex',
    marginTop: '1%',
    marginBottom: '1%',
    flexWrap: 'nowrap',
    flexShrink: 1,
    flexDirection: 'row',
  },
  lessonTimeView: {
    paddingHorizontal: 1,
    paddingVertical: 2,
    width: '15%',
    alignItems: 'center',
  },
  lessonTimeText: {
    fontSize: 14,
  },
  lessonPairText: {
    fontSize: 13,
  },
  lessonInfoView: {
    width: '85%',
    // paddingHorizontal: 1,
  },
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
  textTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: "2%"
  }
});
