import React from 'react';
import { StyleSheet, ToastAndroid, View } from 'react-native';

import CardHeaderIn from '../../components/CardHeaderIn';
import ClickableText from '../../components/ClickableText';
import Text from '../../components/Text';
import { useClient } from '../../data/client';
import { useGlobalStyles } from '../../hooks';
import useQuery from '../../hooks/useQuery';
import { RequestType } from '../../models/results';
import { ICheckPoint } from '../../models/sessionPoints';
import { formatCheckPointScore } from '../../utils/texts';

const getCheckpointTitle = (theme: string, number: number) => `КТ ${number}: ${theme}`;

const cutTypeControl = (typeControl: string): string =>
  typeControl
    .split(' ')
    .map((char) => char.charAt(0).toUpperCase())
    .join('');

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
});

const CheckPointDetails = ({ checkPoint, index }: { checkPoint: ICheckPoint; index: number }) => {
  const client = useClient();
  const globalStyles = useGlobalStyles();
  const { data, isLoading } = useQuery({
    method: client.getPointUpdates,
    payload: {
      data: checkPoint.updatesUrl,
      requestType: RequestType.tryFetch,
    },
    skipInitialGet: !checkPoint.teacher || !checkPoint.updatesUrl,
  });

  let scoreText: string | number = formatCheckPointScore(checkPoint) || checkPoint.points;
  const lastDate = data && data.date ? data.date : checkPoint.date;

  const rowTextStyle = StyleSheet.compose(globalStyles.fontColorForBlock, { fontSize: 15 });
  const Row = ({ first, second }: { first: string | number; second: string | number }) => (
    <View style={styles.row}>
      <Text style={rowTextStyle} colorVariant={'block'}>
        {first}
      </Text>
      <Text style={rowTextStyle} colorVariant={'block'}>
        {second}
      </Text>
    </View>
  );

  return (
    <CardHeaderIn key={index} topText={getCheckpointTitle(checkPoint.theme, index + 1)}>
      <Row first={'Оценка:'} second={scoreText} />
      <Row first={'Проходной балл:'} second={checkPoint.passScore} />
      <Row first={'Текущий балл:'} second={checkPoint.currentScore} />
      <Row first={'Максимальный балл:'} second={checkPoint.maxScore} />
      {!!checkPoint.teacher && (
        <>
          <Row first={'Преподаватель:'} second={checkPoint.teacher} />
          <Row first={'Дата:'} second={isLoading ? 'Загрузка...' : lastDate} />
        </>
      )}
      <Row first={'Вид работы:'} second={checkPoint.typeWork} />
      <View style={styles.row}>
        <Text style={rowTextStyle} colorVariant={'block'}>
          {'Вид контроля:'}
        </Text>
        <ClickableText
          text={cutTypeControl(checkPoint.typeControl)}
          onPress={() => {
            ToastAndroid.show(checkPoint.typeControl, ToastAndroid.LONG);
          }}
          textStyle={[rowTextStyle, { textDecorationLine: 'underline' }]}
        />
      </View>
    </CardHeaderIn>
  );
};

export default CheckPointDetails;
