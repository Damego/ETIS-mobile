import React from 'react';
import { StyleSheet } from 'react-native';

import { useGlobalStyles } from '../hooks';
import { fontSize } from '../utils/texts';
import Card from './Card';
import Text from './Text';

const styles = StyleSheet.create({
  cardView: {
    alignItems: 'center',
  },
  text: {
    fontWeight: '500',
    ...fontSize.medium,
  },
});

const WarningCard = ({ text }: { text: string }) => {
  const globalStyles = useGlobalStyles();

  return (
    <Card style={[globalStyles.primaryBackgroundColor, styles.cardView]}>
      <Text style={styles.text} colorVariant={'primaryBlock'}>
        {text}
      </Text>
    </Card>
  );
};

export default WarningCard;
