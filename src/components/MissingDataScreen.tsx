import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useGlobalStyles } from '../hooks';
import { fontSize } from '../utils/texts';

const styles = StyleSheet.create({
  cardView: {
    padding: '2%',
    alignItems: 'center',
    flex: 1,
    display: 'flex',
    marginBottom: '3%',
    borderRadius: 10,
  },
  text: {
    fontWeight: 'bold',
  },
});

const MissingDataScreen = () => {
  const globalStyles = useGlobalStyles();

  return (
    <View style={[styles.cardView]}>
      <Text style={[fontSize.large, styles.text, globalStyles.textColor]}>
        Данные временно недоступны Попробуйте попытку позже
      </Text>
    </View>
  );
};

export default MissingDataScreen;
