import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  pointsView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalPoints: {
    alignItems: 'center',
    width: '25%',
  },
  markNumberText: {
    fontWeight: '600',
  },
  markView: {
    marginTop: '1%',
    alignItems: 'flex-end',
  },
  markWordText: {
    fontWeight: '600',
  },
  colorMark2: {
    color: '#CE2539',
  },
  colorMark3: {
    color: '#f6d832',
  },
  colorMark4: {
    color: '#76c248',
  },
  colorMark5: {
    color: '#5c9f38',
  },
  modalRowStyle: {
    flexDirection: 'row',
    width: '90%',
    alignSelf: 'center',
  },
  modalRootStyle: {
    alignItems: 'center',
    flex: 1,
    marginVertical: '20%',
    marginHorizontal: '2%',
    height: '100%',
  },
  scrollContainer: {
    width: '90%',
    gap: 10,
    alignSelf: 'center',
    alignItems: 'center',
  },
  detailsText: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    textDecorationLine: 'underline',
  },
  modalCloseText: {
    position: 'absolute',
    bottom: '2%',
    width: '100%',
    alignItems: 'center',
  },
});

export default styles;
