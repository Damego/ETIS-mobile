import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useGlobalStyles } from '../../hooks';
import { ICheckPoint } from '../../models/sessionPoints';

const styles = StyleSheet.create({
  markNeutral: {
    fontSize: 16,
    fontWeight: '600',
  },
  markFail: {
    color: '#CE2539',
    fontSize: 16,
    fontWeight: '600',
  },
});

const getCheckPointScore = (checkPoint: ICheckPoint) => {
  if (checkPoint.isAbsent) return 'н';
  else if (Number.isNaN(checkPoint.points)) return '-';

  return checkPoint.currentScore;
};

interface SubjectCheckPointsProps {
  data: ICheckPoint[];
}

const SubjectCheckPoints = ({ data }: SubjectCheckPointsProps) => {
  const globalStyles = useGlobalStyles();

  return data.map((checkPoint, index) => {
    const checkPointName = `КТ ${index + 1}`;
    const score: string | number = getCheckPointScore(checkPoint);
    const pointsString = `${checkPointName}: ${score} / ${checkPoint.passScore} / ${checkPoint.maxScore}`;
    const styleCondition =
      ((Number.isNaN(checkPoint.points) && checkPoint.isAbsent) ||
        checkPoint.points < checkPoint.passScore) &&
      !checkPoint.isIntroductionWork;

    return (
      <Text
        style={styleCondition ? styles.markFail : [styles.markNeutral, globalStyles.textColor]}
        key={checkPoint.theme}
      >
        {pointsString}
      </Text>
    );
  });
};

export default SubjectCheckPoints;
