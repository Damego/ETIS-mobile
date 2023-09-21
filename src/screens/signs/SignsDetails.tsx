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
    marginVertical: 15,
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
  return (
    <View style={[styles.rowStyle, style]}>
      <Text style={useGlobalStyles().textColor}>{first}</Text>
      <Text style={useGlobalStyles().textColor}>{second}</Text>
    </View>
  );
};

export default function SignsDetails({ route, navigation }) {
  const globalStyles = useGlobalStyles();
  const subject: ISubject = route.params.subject;

  const getCheckpointTitle = (theme: string, number: number) => {
    return `КТ ${number}: ${theme}`;
  };

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={[globalStyles.textColor, fontSize.large, { maxWidth: '80%' }]}>
          {subject.name}
        </Text>
        <TotalPoints subject={subject} style={{ alignItems: 'center' }} />
      </View>
      {subject.checkPoints.map((checkPoint: ICheckPoint, index: number) => (
        <CardHeaderIn
          key={index}
          style={{ alignSelf: 'stretch' }}
          topText={getCheckpointTitle(checkPoint.theme, index + 1)}
        >
          <Row first={'Оценка: '} second={getCheckPointScore(checkPoint)} />
          <Row first={'Проходной балл: '} second={checkPoint.passScore} />
          <Row first={'Текущий балл: '} second={checkPoint.currentScore} />
          <Row first={'Максимальный балл: '} second={checkPoint.maxScore} />
          <Row first={`Вид работы: ${checkPoint.typeWork}`} />
          <Row first={`Вид контроля: ${checkPoint.typeControl}`} />
          {checkPoint.teacher && (
            <>
              <Row first={`Преподаватель: ${checkPoint.teacher}`} />
              <Row first={`Дата: ${checkPoint.date}`} />
            </>
          )}
        </CardHeaderIn>
      ))}
    </Screen>
  );
}
