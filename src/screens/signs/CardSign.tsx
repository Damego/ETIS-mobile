import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import CardHeaderIn from '../../components/CardHeaderIn';
import ClickableText from '../../components/ClickableText';
import { useGlobalStyles } from '../../hooks';
import { ISubject } from '../../models/sessionPoints';
import { fontSize } from '../../utils/texts';
import SubjectCheckPoints from './SubjectCheckPoints';
import TotalPoints from './TotalPoints';

const styles = StyleSheet.create({
  pointsView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalPoints: {
    alignItems: 'center',
    width: '25%',
  },
  markView: {
    marginTop: '1%',
    alignItems: 'flex-end',
  },
  markWordText: {
    fontWeight: '600',
    marginRight: 10,
  },
});

interface CardSignProps {
  subject: ISubject;
}

const CardSign = ({ subject }: CardSignProps) => {
  const globalStyles = useGlobalStyles();
  const navigation = useNavigation();

  return (
    <CardHeaderIn topText={subject.name}>
      <View style={styles.pointsView}>
        <TouchableOpacity
          /* @ts-ignore */
          onPress={() => navigation.navigate('SignsDetails', { subject })}
          activeOpacity={0.45}
        >
          <SubjectCheckPoints data={subject.checkPoints} />
        </TouchableOpacity>
        <TotalPoints subject={subject} style={styles.totalPoints} />
      </View>
      <View style={styles.pointsView}>
        {subject.mark !== null && (
          <View style={styles.markView}>
            <Text style={[fontSize.medium, styles.markWordText, globalStyles.textColor]}>
              Оценка: {subject.mark}
            </Text>
          </View>
        )}
      </View>
    </CardHeaderIn>
  );
};

export default CardSign;
