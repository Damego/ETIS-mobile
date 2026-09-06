import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, ToastAndroid, View } from 'react-native';

import ClickableText from '~/components/ClickableText';
import Text from '~/components/Text';
import { useClient } from '~/data/client';
import useQuery from '~/hooks/useQuery';
import { RequestType } from '~/models/results';
import { ICheckPoint } from '~/models/sessionPoints';
import { fontSize, formatCheckPointScore } from '~/utils/texts';

const cutTypeControl = (typeControl: string): string =>
  typeControl
    .split(' ')
    .map((char) => char.charAt(0).toUpperCase())
    .join('');

const CheckPointDetails = ({ checkPoint, index }: { checkPoint: ICheckPoint; index: number }) => {
  const { t } = useTranslation();
  const client = useClient();
  const { data, isLoading } = useQuery({
    method: client.getPointUpdates,
    payload: {
      data: checkPoint.updatesUrl,
      requestType: RequestType.tryFetch,
    },
    skipInitialGet: !checkPoint.teacher || !checkPoint.updatesUrl,
  });

  const scoreText: string | number = formatCheckPointScore(checkPoint);
  const lastDate = data && data.date ? data.date : checkPoint.date;

  const Row = ({ first, second }: { first: string | number; second: string | number }) => (
    <View style={styles.row}>
      <Text style={styles.rowText}>{first}</Text>
      <Text style={styles.rowText}>{second}</Text>
    </View>
  );

  return (
    <View>
      <Text style={styles.titleText}>{t('checkPoint.title', { number: index + 1, theme: checkPoint.theme })}</Text>
      <Row first={t('checkPoint.score')} second={scoreText} />
      <Row first={t('checkPoint.passScore')} second={checkPoint.passScore} />
      <Row first={t('checkPoint.currentScore')} second={checkPoint.currentScore} />
      <Row first={t('checkPoint.maxScore')} second={checkPoint.maxScore} />
      {Boolean(checkPoint.teacher) && (
        <>
          <Row first={t('checkPoint.teacher')} second={checkPoint.teacher} />
          <Row first={t('checkPoint.date')} second={isLoading ? t('common.loading') : lastDate} />
        </>
      )}
      <Row first={t('checkPoint.workType')} second={checkPoint.typeWork} />
      <View style={styles.row}>
        <Text style={styles.rowText}>{t('checkPoint.controlType')}</Text>
        <ClickableText
          text={cutTypeControl(checkPoint.typeControl)}
          onPress={() => {
            ToastAndroid.show(checkPoint.typeControl, ToastAndroid.LONG);
          }}
          textStyle={styles.clickableText}
        />
      </View>
    </View>
  );
};

export default CheckPointDetails;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  rowText: {
    fontSize: 16,
  },
  titleText: {
    ...fontSize.big,
    fontWeight: 'bold',
  },
  clickableText: {
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});
