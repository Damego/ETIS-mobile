import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import CardHeaderIn from '../../components/CardHeaderIn';
import { useGlobalStyles } from '../../hooks';
import { ISubject } from '../../models/sessionPoints';
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
    fontSize: 36,
    fontWeight: '600',
  },
  markView: {
    marginTop: '1%',
    alignItems: 'flex-end',
  },
  markWordText: {
    fontSize: 16,
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

const getPointsWord = (points) => {
  let pointsWord = 'балл';
  const mod10 = points % 10;
  if ([2, 3, 4].includes(mod10)) pointsWord += 'а';
  else if ([0, 5, 6, 7, 8, 9].includes(mod10)) pointsWord += 'ов';

  return pointsWord;
};

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
          <Text style={[styles.markNumberText, textStyle]}>{subject.totalPoints}</Text>
          <Text style={[styles.markWordText, globalStyles.textColor]}>{pointsWord}</Text>
        </View>
      </View>

      {subject.mark !== null && (
        <View style={styles.markView}>
          <Text style={[styles.markWordText, globalStyles.textColor]}>Оценка: {subject.mark}</Text>
        </View>
      )}
    </CardHeaderIn>
  );
};

export default CardSign;
