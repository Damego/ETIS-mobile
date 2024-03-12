import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { DisciplineTypes } from '../models/other';
import Text from './Text';
import { getDisciplineTypeName } from '../utils/texts';

const DisciplineType = ({
  type,
  size = 'standard',
}: {
  type: DisciplineTypes;
  size?: 'small' | 'standard';
}) => {
  const composed = useMemo(
    () => StyleSheet.compose(styles.base, disciplineTypeStyles[type]),
    [type]
  );
  const name = getDisciplineTypeName(type);

  return (
    <View style={composed}>
      <Text style={styles[size]}>{name}</Text>
    </View>
  );
};

export default DisciplineType;

const styles = StyleSheet.create({
  base: {
    borderRadius: 5,
    paddingHorizontal: '2%',
    paddingVertical: '1%',
    alignSelf: 'flex-start',
    backgroundColor: '#B0BEC5',
  },
  standard: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  small: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
  },
});

const disciplineTypeStyles: { [key in DisciplineTypes] } = StyleSheet.create({
  LECTURE: {
    backgroundColor: '#C62E3E',
  },
  PRACTICE: {
    backgroundColor: '#0053cd',
  },
  LABORATORY: {
    backgroundColor: '#4CAF50',
  },
  EXAM: styles.base,
  TEST: styles.base,
});
