import { StyleProp, Text, View, ViewStyle, StyleSheet } from 'react-native';

import { useGlobalStyles } from '../../hooks';
import { ISubject } from '../../models/sessionPoints';
import { fontSize, getPointsWord } from '../../utils/texts';

const styles = StyleSheet.create({
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
});

const getSubjectPointsStyle = (subject: ISubject, defaultTextColor) => {
  if (subject.checkPoints.length === 0) return defaultTextColor;

  let textStyle;
  subject.checkPoints.every((checkPoint) => {
    if (!checkPoint.isIntroductionWork) {
      if (checkPoint.failed) {
        textStyle = styles.colorMark2;
        return false;
      }
    }
    return true;
  });

  if (textStyle) return textStyle;

  if (subject.totalPoints === 0) return defaultTextColor;
  if (subject.totalPoints < 61) return styles.colorMark3;
  if (subject.totalPoints < 81) return styles.colorMark4;
  return styles.colorMark5;
};

const TotalPoints = ({ subject, style }: { subject: ISubject, style?: StyleProp<ViewStyle> }) => {
  const globalStyles = useGlobalStyles();

  const textStyle = getSubjectPointsStyle(subject, globalStyles.textColor);
  const pointsWord = getPointsWord(subject.totalPoints);

  return (
    <View style={style}>
      <Text style={[fontSize.xxlarge, { fontWeight: '600' }, textStyle]}>
        {subject.totalPoints}
      </Text>
      <Text style={[fontSize.medium, { fontWeight: '600' }, globalStyles.textColor]}>
        {pointsWord}
      </Text>
    </View>
  );
};

export default TotalPoints;
