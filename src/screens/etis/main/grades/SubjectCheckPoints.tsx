import React from 'react';
import { useTranslation } from 'react-i18next';
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

const getCheckPointScore = (checkPoint: ICheckPoint) => {
  const formatted = formatCheckPointScore(checkPoint);
  if (formatted !== '-') return formatted;

  // Вводные работы в рейтинге не показываются, поэтому выводим просто полученные баллы
  return checkPoint.isIntroductionWork ? checkPoint.points : checkPoint.currentScore;
};

const getPointsString = (checkPoint: ICheckPoint, number: number, t: (key: string, options?: Record<string, unknown>) => string): string => {
  const checkPointName = t('checkPoint.shortTitle', { number });
  const scoreText: string | number = getCheckPointScore(checkPoint);

  if (checkPoint.isIntroductionWork) return `${checkPointName}: ${scoreText}`;
  return t('checkPoint.scoreLine', { name: checkPointName, score: scoreText, maxScore: checkPoint.maxScore });
};

const SubjectCheckPoints = ({ data }: { readonly data: ICheckPoint[] }): React.ReactNode => {
  const { t } = useTranslation();
  if (!data.length) return;

  return (
    <View>
      {data.map((checkPoint, index) => {
        const pointsString = getPointsString(checkPoint, index + 1, t);

        return (
          <Text
            key={index.toString()}
            style={checkPoint.failed ? styles.markFail : styles.markNeutral}
          >
            {pointsString}
          </Text>
        );
      })}
    </View>
  );
};

export default SubjectCheckPoints;
