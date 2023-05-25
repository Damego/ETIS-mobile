import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import CardHeaderIn from '../../components/CardHeaderIn';
import SubjectCheckPoint from './Subject';

const styles = StyleSheet.create({
  cardView: {
    margin: '4%',
    marginTop: 0,
  },
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
    marginTop: '2%',
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
  colorNoMark: {
    color: '#000',
  },
});

const getPointsWord = (points) => {
  let pointsWord = 'балл';
  const mod10 = points % 10;
  if ([2, 3, 4].includes(mod10)) pointsWord += 'а';
  else if ([0, 5, 6, 7, 8, 9].includes(mod10)) pointsWord += 'ов';

  return pointsWord;
};

const getSubjectPointsStyle = (subject, totalPoint) => {
  if (subject.info.length === 0) return styles.colorNoMark;

  let textStyle;
  subject.info.forEach(({ passScore, points, isAbsent, isIntroductionWork }) => {
    if (!isIntroductionWork) {
      if (isAbsent || points < passScore) textStyle = styles.colorMark2;
      else if (Number.isNaN(points) && !isAbsent) textStyle = styles.colorNoMark;
    }
  });

  if (textStyle) return textStyle;

  if (totalPoint < 61) return styles.colorMark3;
  if (totalPoint < 81) return styles.colorMark4;
  return styles.colorMark5;
};

const getSubjectTotalPoints = (subject) => {
  let subjectTotalPoints = 0;
  subject.info.forEach(({ currentScore, isIntroductionWork }) => {
    subjectTotalPoints += Number.isNaN(currentScore) || isIntroductionWork ? 0 : currentScore;
  });
  subjectTotalPoints = Number(subjectTotalPoints.toFixed(1));
  if (subjectTotalPoints % 1 === 0) subjectTotalPoints = Number(subjectTotalPoints.toFixed(0));

  return subjectTotalPoints;
};

const CardSign = ({ subject }) => {
  const subjectTotalPoints = getSubjectTotalPoints(subject);
  const textStyle = getSubjectPointsStyle(subject, subjectTotalPoints);
  const pointsWord = getPointsWord(subjectTotalPoints);

  return (
    <CardHeaderIn topText={subject.subject}>
      <View style={styles.cardView}>
        <View style={styles.pointsView}>
          <View style={styles.subjects}>
            <SubjectCheckPoint data={subject.info} />
          </View>
          <View style={styles.totalPoints}>
            <Text style={[styles.markNumberText, textStyle]}>{subjectTotalPoints}</Text>
            <Text style={styles.markWordText}>{pointsWord}</Text>
          </View>
        </View>
        {subject.mark !== null && (
          <View style={styles.markView}>
            <Text style={styles.markWordText}>Оценка: {subject.mark}</Text>
          </View>
        )}
      </View>
    </CardHeaderIn>
  );
};

export default CardSign;