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

const getCheckPointScore = (checkPoint: ICheckPoint) => {
  if (checkPoint.isAbsent) return 'н';
  else if (Number.isNaN(checkPoint.points) || !checkPoint.points) return '-';

  // Вводные работы в рейтинге не показываются, поэтому выводим просто полученные баллы
  return checkPoint.isIntroductionWork ? checkPoint.points : checkPoint.currentScore;
};

interface SubjectCheckPointsProps {
  data: ICheckPoint[];
}

const SubjectCheckPoints = ({ data }: SubjectCheckPointsProps) => {
  const globalStyles = useGlobalStyles();

  return data.map((checkPoint, index) => {
    const checkPointName = `КТ ${index + 1}`;
    const scoreText: string | number = getCheckPointScore(checkPoint);
    const pointsString = `${checkPointName}: ${scoreText} / ${checkPoint.passScore} / ${checkPoint.maxScore}`;
    // Проверка на вводный урок, отсутствовал ли студент, количество баллов >= проходного, оценка вообще поставлена
    const score = checkPoint.isIntroductionWork ? checkPoint.points : checkPoint.currentScore;
    const failStyleCondition =
      (checkPoint.isAbsent || !checkPoint.isIntroductionWork) &&
      score &&
      score < checkPoint.passScore;

    return (
      <Text
        style={
          failStyleCondition
            ? [fontSize.medium, styles.markFail]
            : [fontSize.medium, styles.markNeutral, globalStyles.textColor]
        }
        key={checkPoint.theme}
      >
        {pointsString}
      </Text>
    );
  });
};

export default SubjectCheckPoints;
