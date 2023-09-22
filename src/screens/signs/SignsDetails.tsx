import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';

import CardHeaderIn from '../../components/CardHeaderIn';
import Screen from '../../components/Screen';
import { useGlobalStyles } from '../../hooks';
import { ICheckPoint, ISubject } from '../../models/sessionPoints';
import { fontSize } from '../../utils/texts';
import { getCheckPointScore } from './SubjectCheckPoints';
import TotalPoints from './TotalPoints';

const styles = StyleSheet.create({
  rowStyle: {
    flexDirection: 'row',
    width: '90%',
    alignSelf: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: '2%',
    marginBottom: '2%',
  },
});

const Row = ({
  first,
  second,
}: {
  first: any;
  second?: any;
}) => {
  const globalStyles = useGlobalStyles();
  return (
      <Text style={[globalStyles.textColor, {fontSize: 15}]}>{first}</Text>
      <Text style={[globalStyles.textColor, {fontSize: 15}]}>{second}</Text>
    <View style={styles.rowStyle}>
    </View>
  );
};

const getCheckpointTitle = (theme: string, number: number) => {
  return `КТ ${number}: ${theme}`;
};

const cutTypeControl = (typeControl: string): string => {
  return typeControl
    .split(' ')
    .map((str) => str.charAt(0).toUpperCase())
    .join("");
};

export default function SignsDetails({ route }) {
  const globalStyles = useGlobalStyles();
  const subject: ISubject = route.params.subject;

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={[globalStyles.textColor, fontSize.large, { flex: 1 }]}>
          {subject.name}
        </Text>
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
          <Row first={'Вид контроля:'} second={cutTypeControl(checkPoint.typeControl)} />
        </CardHeaderIn>
      ))}
    </Screen>
  );
}
