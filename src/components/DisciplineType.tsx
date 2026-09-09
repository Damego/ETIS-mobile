import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { LessonTypes } from '~/models/other';
import { borderRadius } from '~/utils/texts';

import Text from './Text';

const DisciplineType = ({
  type,
  size = 'standard',
}: {
  readonly type: LessonTypes;
  readonly size?: 'small' | 'standard';
}) => {
  const composed = useMemo(
    () => StyleSheet.compose(styles.base, disciplineTypeStyles[type]),
    [type]
  );
  const { t } = useTranslation();
  const name = t(`lessonTypes.${type}`);

  return (
    <View style={composed}>
      <Text style={styles[size]}>{name}</Text>
    </View>
  );
};

export default DisciplineType;

const styles = StyleSheet.create({
  base: {
    borderRadius: borderRadius.small,
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

const disciplineTypeStyles: { [key in LessonTypes]: { backgroundColor: string } } = StyleSheet.create({
  LECTURE: {
    backgroundColor: '#C62E3E',
  },
  PRACTICE: {
    backgroundColor: '#0053CD',
  },
  LABORATORY: {
    backgroundColor: '#4CAF50',
  },
  EXAM: {
    backgroundColor: '#512DA8',
  },
  TEST: {
    backgroundColor: '#FBC02D',
  },
});
