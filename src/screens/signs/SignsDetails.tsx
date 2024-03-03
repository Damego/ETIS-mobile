import React from 'react';
import { StyleSheet, View } from 'react-native';

import Screen from '../../components/Screen';
import Text from '../../components/Text';
import { ICheckPoint } from '../../models/sessionPoints';
import { RootStackScreenProps } from '../../navigation/types';
import { fontSize } from '../../utils/texts';
import CheckPointDetails from './CheckPointDetails';
import TotalPoints from './TotalPoints';

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: '2%',
    marginBottom: '2%',
    gap: 5,
  },
});

export default function SignsDetails({ route }: RootStackScreenProps<'SignsDetails'>) {
  const { subject } = route.params;

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={[fontSize.large, { flex: 1 }]}>{subject.name}</Text>
        <TotalPoints subject={subject} style={{ alignItems: 'center' }} />
      </View>

      {subject.checkPoints.map((checkPoint: ICheckPoint, index: number) => (
        <CheckPointDetails checkPoint={checkPoint} index={index} key={index} />
      ))}
    </Screen>
  );
}
