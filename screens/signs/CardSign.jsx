import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import CardHeaderIn from '../../components/CardHeaderIn';
import Subject from './Subject';

const styles = StyleSheet.create({
  cardMainView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: '4%',
    marginBottom: '4%',
    marginRight: '4%',
    justifyContent: 'space-between',
  },
  markView: {
    alignItems: 'center',
    width: '25%',
  },
  markNumberText: {
    fontSize: 36,
    fontWeight: '600',
  },
  subjects: {},
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

const CardSign = ({ subject }) => {
  let collectedPoints = 0;
  let textStyle = null;

  subject.info.forEach(({ maxScore, passScore, mark, isAbsent }) => {
    collectedPoints += Number.isNaN(mark) || maxScore === 0 ? 0 : mark;

    if (textStyle !== null) return;
    if ((isAbsent || mark < passScore) && maxScore !== 0.0) textStyle = styles.colorMark2;
    else if (Number.isNaN(mark)) textStyle = styles.colorNoMark;
  });
  collectedPoints =
    collectedPoints.toFixed(1) % 1 === 0 ? collectedPoints.toFixed(0) : collectedPoints.toFixed(1);

  let pointsWord = 'балл';
  const mod10 = collectedPoints % 10;
  if ([2, 3, 4].includes(mod10)) pointsWord += 'а';
  else if ([0, 5, 6, 7, 8, 9].includes(mod10)) pointsWord += 'ов';

  if (textStyle === null) {
    if (collectedPoints < 41) textStyle = styles.colorMark2;
    else if (collectedPoints < 61) textStyle = styles.colorMark3;
    else if (collectedPoints < 81) textStyle = styles.colorMark4;
    else textStyle = styles.colorMark5;
  }

  return (
    <CardHeaderIn topText={subject.subject}>
      <View style={styles.cardMainView}>
        <View style={styles.subjects}>
          <Subject data={subject} />
        </View>
        <View style={styles.markView}>
          <Text style={[styles.markNumberText, textStyle]}>{collectedPoints}</Text>
          <Text style={styles.markWordText}>{pointsWord}</Text>
        </View>
      </View>
    </CardHeaderIn>
  );
};

export default CardSign;
