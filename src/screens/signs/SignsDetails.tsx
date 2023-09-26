import React from 'react';
import { StyleSheet, Text, ToastAndroid, View } from 'react-native';

import CardHeaderIn from '../../components/CardHeaderIn';
import ClickableText from '../../components/ClickableText';
import Screen from '../../components/Screen';
import { useGlobalStyles } from '../../hooks';
import { ICheckPoint } from '../../models/sessionPoints';
import { RootStackScreenProps } from '../../navigation/types';
import { fontSize } from '../../utils/texts';
import { getCheckPointScore } from './SubjectCheckPoints';
import TotalPoints from './TotalPoints';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: '2%',
    marginBottom: '2%',
    gap: 5,
  },
});

const getCheckpointTitle = (theme: string, number: number) => `КТ ${number}: ${theme}`;

const cutTypeControl = (typeControl: string): string =>
  typeControl
    .split(' ')
    .map((char) => char.charAt(0).toUpperCase())
    .join('');

export default function SignsDetails({ route }: RootStackScreenProps<'SignsDetails'>) {
  const globalStyles = useGlobalStyles();
  const { subject } = route.params;

  const rowTextStyle = StyleSheet.compose(globalStyles.textColor, { fontSize: 15 });

  const Row = ({ first, second }: { first: string | number; second: string | number }) => (
    <View style={styles.row}>
      <Text style={rowTextStyle}>{first}</Text>
      <Text style={rowTextStyle}>{second}</Text>
    </View>
  );

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={[globalStyles.textColor, fontSize.large, { flex: 1 }]}>{subject.name}</Text>
        <TotalPoints subject={subject} style={{ alignItems: 'center' }} />
      </View>

      {subject.checkPoints.map((checkPoint: ICheckPoint, index: number) => (
        <CardHeaderIn key={index} topText={getCheckpointTitle(checkPoint.theme, index + 1)}>
          <Row first={'Оценка:'} second={getCheckPointScore(checkPoint)} />
          <Row first={'Проходной балл:'} second={checkPoint.passScore} />
          <Row first={'Текущий балл:'} second={checkPoint.currentScore} />
          <Row first={'Максимальный балл:'} second={checkPoint.maxScore} />
          {checkPoint.teacher && (
            <>
              <Row first={'Преподаватель:'} second={checkPoint.teacher} />
              <Row first={'Дата:'} second={checkPoint.date} />
            </>
          )}
          <Row first={'Вид работы:'} second={checkPoint.typeWork} />
          <View style={styles.row}>
            <Text style={rowTextStyle}>{'Вид контроля:'}</Text>
            <ClickableText
              text={cutTypeControl(checkPoint.typeControl)}
              onPress={() => {
                ToastAndroid.showWithGravity(
                  checkPoint.typeControl,
                  ToastAndroid.SHORT,
                  ToastAndroid.CENTER
                );
              }}
              textStyle={[rowTextStyle, { textDecorationLine: 'underline' }]}
            />
          </View>
        </CardHeaderIn>
      ))}
    </Screen>
  );
}
