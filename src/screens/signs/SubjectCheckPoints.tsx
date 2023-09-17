import React from 'react';
import { StyleSheet, Text } from 'react-native';

import { useGlobalStyles } from '../../hooks';
import { ICheckPoint } from '../../models/sessionPoints';
import { fontSize } from '../../utils/texts';

const styles = StyleSheet.create({
  markNeutral: {
    fontWeight: '600',
  },
  markFail: {
    color: '#CE2539',
    fontWeight: '600',
  },
});

export const getCheckPointScore = (checkPoint: ICheckPoint) => {
  if (checkPoint.isAbsent) return 'н';
  else if (Number.isNaN(checkPoint.points) || !checkPoint.points) return '-';

  // Вводные работы в рейтинге не показываются, поэтому выводим просто полученные баллы
  return checkPoint.isIntroductionWork ? checkPoint.points : checkPoint.currentScore;
};

interface SubjectCheckPointsProps {
  data: ICheckPoint[];
}

const SubjectCheckPoints = ({ data }: SubjectCheckPointsProps): React.ReactNode => {
  const globalStyles = useGlobalStyles();

  return data.map((checkPoint, index) => {
    const checkPointName = `КТ ${index + 1}`;
    const scoreText: string | number = getCheckPointScore(checkPoint);
    const pointsString = `${checkPointName}: ${scoreText} / ${checkPoint.passScore} / ${checkPoint.maxScore}`;

    return (
      <Text
        style={
          checkPoint.failed
            ? [fontSize.medium, styles.markFail]
            : [fontSize.medium, styles.markNeutral, globalStyles.textColor]
        }
        key={checkPoint.theme + index}
      >
        {pointsString}
      </Text>
    );
  });
};

export default SubjectCheckPoints;
