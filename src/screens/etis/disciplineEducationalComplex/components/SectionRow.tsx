import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import Text from '~/components/Text';
import RightIcon from '~/screens/etis/disciplineEducationalComplex/RightIcon';
import { fontSize } from '~/utils/texts';

// Высота первой строки заголовка: стрелка выравнивается по её центру,
// поэтому у всех секций шевроны находятся на одном уровне независимо
// от того, переносится заголовок на несколько строк или нет.
// Текст с flex: 1 занимает всю ширину кроме иконки — стрелка всегда
// прижата к правому краю (ClickableText здесь не подходит: его
// промежуточный View без flex при длинном заголовке вытесняет иконку за край)
const TITLE_LINE_HEIGHT = 24;

const SectionRow = ({ label, onPress }: { label: string; onPress(): void }) => (
  <TouchableOpacity onPress={onPress} style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.iconWrapper}>
      <RightIcon />
    </View>
  </TouchableOpacity>
);

export default SectionRow;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  label: {
    ...fontSize.big,
    fontWeight: 'bold',
    lineHeight: TITLE_LINE_HEIGHT,
    flex: 1,
  },
  iconWrapper: {
    height: TITLE_LINE_HEIGHT,
    justifyContent: 'center',
  },
});
