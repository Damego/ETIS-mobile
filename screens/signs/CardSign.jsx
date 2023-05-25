import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import CardHeaderIn from '../../components/CardHeaderIn';
import SubjectCheckPoint from './Subject';
import { useGlobalStyles } from '../../hooks';

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
  }
});

const getPointsWord = (points) => {
  let pointsWord = 'балл';
  const mod10 = points % 10;
  if ([2, 3, 4].includes(mod10)) pointsWord += 'а';
  else if ([0, 5, 6, 7, 8, 9].includes(mod10)) pointsWord += 'ов';

  return pointsWord;
};

const getSubjectPointsStyle = (subject, totalPoint, defaultTextColor) => {
  if (subject.info.length === 0) return defaultTextColor;

  let textStyle;
  subject.info.forEach(({ maxScore, passScore, points, isAbsent }) => {
    if ((isAbsent || points < passScore) && maxScore !== 0.0) textStyle = styles.colorMark2;
    if (Number.isNaN(points)) textStyle = defaultTextColor;
  });

  if (textStyle) return textStyle;

  if (totalPoint < 61) return styles.colorMark3;
  if (totalPoint < 81) return styles.colorMark4;
  return styles.colorMark5;
};

const getSubjectTotalPoints = (subject) => {
  let subjectTotalPoints = 0;
  subject.info.forEach(({ maxScore, points }) => {
    subjectTotalPoints += Number.isNaN(points) || maxScore === 0 ? 0 : points;
  });
  subjectTotalPoints = Number(subjectTotalPoints.toFixed(1));
  if (subjectTotalPoints % 1 === 0) subjectTotalPoints = Number(subjectTotalPoints.toFixed(0));

  return subjectTotalPoints;
};

const CardSign = ({ subject }) => {
  const globalStyles = useGlobalStyles();

  const subjectTotalPoints = getSubjectTotalPoints(subject);
  const textStyle = getSubjectPointsStyle(subject, subjectTotalPoints, globalStyles.textColor);
  const pointsWord = getPointsWord(subjectTotalPoints);

  return (
    <CardHeaderIn topText={subject.subject}>
      <View style={styles.pointsView}>
        <View style={styles.subjects}>
          <SubjectCheckPoint data={subject.info} />
        </View>
        <View style={styles.totalPoints}>
          <Text style={[styles.markNumberText, textStyle]}>{subjectTotalPoints}</Text>
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
