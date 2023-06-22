import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import CardHeaderIn from '../../components/CardHeaderIn';
import { useGlobalStyles } from '../../hooks';
import { ISubject } from '../../models/sessionPoints';
import { fontSize, getPointsWord } from '../../utils/texts';
import SubjectCheckPoints from './SubjectCheckPoints';

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
});

const getSubjectPointsStyle = (subject: ISubject, defaultTextColor) => {
  if (subject.checkPoints.length === 0) return defaultTextColor;

  let textStyle;
  subject.checkPoints.forEach((checkPoint) => {
    if (!checkPoint.isIntroductionWork) {
      const score = checkPoint.isIntroductionWork ? checkPoint.points : checkPoint.currentScore;
      if (checkPoint.isAbsent || (checkPoint.hasPoints && score < checkPoint.passScore))
        textStyle = styles.colorMark2;
      else if (!checkPoint.hasPoints && !checkPoint.isAbsent) textStyle = defaultTextColor;
    }
  });

  if (textStyle) return textStyle;

  if (subject.totalPoints < 61) return styles.colorMark3;
  if (subject.totalPoints < 81) return styles.colorMark4;
  return styles.colorMark5;
};

interface CardSignProps {
  subject: ISubject;
}

const CardSign = ({ subject }: CardSignProps) => {
  const globalStyles = useGlobalStyles();

  const textStyle = getSubjectPointsStyle(subject, globalStyles.textColor);
  const pointsWord = getPointsWord(subject.totalPoints);

  return (
    <CardHeaderIn topText={subject.name}>
      <View style={styles.pointsView}>
        <View>
          <SubjectCheckPoints data={subject.checkPoints} />
        </View>

        <View style={styles.totalPoints}>
          <Text style={[fontSize.xxlarge, styles.markNumberText, textStyle]}>
            {subject.totalPoints}
          </Text>
          <Text style={[fontSize.medium, styles.markWordText, globalStyles.textColor]}>
            {pointsWord}
          </Text>
        </View>
      </View>

      {subject.mark !== null && (
        <View style={styles.markView}>
          <Text style={[fontSize.medium, styles.markWordText, globalStyles.textColor]}>
            Оценка: {subject.mark}
          </Text>
        </View>
      )}
    </CardHeaderIn>
  );
};

export default CardSign;
