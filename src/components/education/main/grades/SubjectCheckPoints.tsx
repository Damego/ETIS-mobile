import React from 'react';
import { StyleSheet, View } from 'react-native';
import Text from '~/components/Text';
import { ICheckPoint } from '~/models/sessionPoints';
import { fontSize, formatCheckPointScore } from '~/utils/texts';

const styles = StyleSheet.create({
  markNeutral: {
    ...fontSize.medium,
  },
  markFail: {
    color: '#CE2539',
    ...fontSize.medium,
  },
});

export const getCheckPointScore = (checkPoint: ICheckPoint) => {
  const formatted = formatCheckPointScore(checkPoint);
  if (formatted) return formatted;

  // Вводные работы в рейтинге не показываются, поэтому выводим просто полученные баллы
  return checkPoint.isIntroductionWork ? checkPoint.points : checkPoint.currentScore;
};

const getPointsString = (checkPoint: ICheckPoint, number: number): string => {
  const checkPointName = `КТ ${number}`;
  const scoreText: string | number = getCheckPointScore(checkPoint);

  if (checkPoint.isIntroductionWork) return `${checkPointName}: ${scoreText}`;
  return `${checkPointName}: ${scoreText} из ${checkPoint.maxScore}`;
};

const SubjectCheckPoints = ({ data }: { data: ICheckPoint[] }): React.ReactNode => {
  if (!data.length) return;

  return (
    <View>
      {data.map((checkPoint, index) => {
        const pointsString = getPointsString(checkPoint, index + 1);

        return (
          <Text
            style={checkPoint.failed ? styles.markFail : styles.markNeutral}
            key={index.toString()}
          >
            {pointsString}
          </Text>
        );
      })}
    </View>
  );
};

export default SubjectCheckPoints;
