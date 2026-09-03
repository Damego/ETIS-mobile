import React from 'react';
import { StyleSheet, View } from 'react-native';

import CenteredText from '~/components/CenteredText';
import Text from '~/components/Text';
import { useAppSelector } from '~/hooks';
import { getEmptyDayResponses } from '~/utils/events';
import { borderRadius } from '~/utils/texts';
import { getRandomItem } from '~/utils/utils';

const NoPairs = () => {
  const theme = useAppSelector((state) => state.settings.config.theme);
  // Ответ фиксирован на монтирование, а не меняется при каждом ре-рендере
  const response = React.useMemo(() => getRandomItem(getEmptyDayResponses(theme)), [theme]);

  return (
    <View style={styles.view}>
      <CenteredText>В этот день занятий нет</CenteredText>
      <Text>{response}</Text>
    </View>
  );
};

export default NoPairs;

const styles = StyleSheet.create({
  view: {
    width: '90%',
    alignSelf: 'center',
    marginTop: '4%',
    paddingVertical: '2%',
    borderRadius: borderRadius.medium,
    alignItems: 'center',
  },
});
