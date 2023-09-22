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
  style,
}: {
  first: any;
  second?: any;
  style?: StyleProp<ViewStyle>;
}) => {
  const globalStyles = useGlobalStyles();
  return (
    <View style={[styles.rowStyle, style]}>
      <Text style={[globalStyles.textColor, {fontSize: 15}]}>{first}</Text>
      <Text style={[globalStyles.textColor, {fontSize: 15}]}>{second}</Text>
    </View>
  );
};

export default function SignsDetails({ route }) {
  const globalStyles = useGlobalStyles();
  const subject: ISubject = route.params.subject;

  const getCheckpointTitle = (theme: string, number: number) => {
    return `КТ ${number}: ${theme}`;
  };

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={[globalStyles.textColor, fontSize.large, { flex: 1 }]}>
          {subject.name}
        </Text>
        <TotalPoints subject={subject} style={{ alignItems: 'center' }} />
      </View>
      {subject.checkPoints.map((checkPoint: ICheckPoint, index: number) => (
        <CardHeaderIn
          key={index}
          topText={getCheckpointTitle(checkPoint.theme, index + 1)}
        >
          <Row first={'Оценка: '} second={getCheckPointScore(checkPoint)} />
          <Row first={'Проходной балл: '} second={checkPoint.passScore} />
          <Row first={'Текущий балл: '} second={checkPoint.currentScore} />
          <Row first={'Максимальный балл: '} second={checkPoint.maxScore} />
          {checkPoint.teacher && (
            <>
              <Row first={`Преподаватель: ${checkPoint.teacher}`} />
              <Row first={`Дата: ${checkPoint.date}`} />
            </>
          )}
          <Row first={`Вид работы: ${checkPoint.typeWork}`} />
          <Row first={`Вид контроля: ${checkPoint.typeControl}`} />
        </CardHeaderIn>
      ))}
    </Screen>
  );
}
