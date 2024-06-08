import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import DisciplineType from '~/components/DisciplineType';
import Text from '~/components/Text';
import { DisciplineTypes } from '~/models/other';
import { IPair } from '~/models/timeTable';

const Pair = ({ pair }: { pair: IPair }) => {


  return (
    <View style={styles.pairContainer}>
      <View style={styles.timeContainer}>
        <Text style={styles.timeStartText}>8:00</Text>
        <Text style={styles.timeEndText}>9:35</Text>
      </View>

      <View style={[styles.lessonContainer]}>
        <Text style={styles.lessonNameText}>Математический анализ</Text>
        <DisciplineType type={DisciplineTypes.LECTURE} />

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Ionicons name={'business-outline'} size={20} />
          <Text>ауд. 517 (2 корпус, 5 этаж)</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Ionicons name={'school-outline'} size={20} />
          <Text>Иванов Иван Петрович</Text>
        </View>
      </View>
    </View>
  );
};

export default Pair;

const styles = StyleSheet.create({
  pairContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  lessonContainer: {
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    flex: 1,
    padding: '2%',
    gap: 4,
  },
  lessonNameText: {
    fontSize: 16,
    fontWeight: '500',
  },
  timeContainer: {
    alignItems: 'center',
  },
  timeStartText: {
    fontSize: 18,
    fontWeight: '500',
  },
  timeEndText: {
    fontSize: 16,
    color: '#808080',
  },
});
