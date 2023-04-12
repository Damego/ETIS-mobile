import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { GLOBAL_STYLES } from '../styles/styles';

const styles = StyleSheet.create({
  cardView: {
    flex: 1,
    display: 'flex',
    width: '96%',
    backgroundColor: '#ffffff',
    marginLeft: '2%',
    marginBottom: '3%',
    borderRadius: 10,
  },
  cardHeaderView: {
    width: '96%',
    marginTop: '2%',
    marginLeft: '4%',
    marginBottom: '5%',
    paddingRight: '2%',
  },
  cardHeaderText: {
    fontSize: 16,
    fontWeight: '600',
  },
  cardMainView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: '4%', 
    marginBottom: '5%',
  },
  markView: {
    alignItems: 'center',
    marginRight: '5%',
  },
  markNumberText: {
    fontSize: 36,
    fontWeight: '600',
    marginBottom: '-5%',
  },
  markWordText: {
    fontSize: 20,
    fontWeight: '600',
  },
});

const CardSign = ({ topText, component , mark}) => (
  <View style={[styles.cardView, GLOBAL_STYLES.shadow]}>
      <View style={styles.cardHeaderView}>
        <Text style={styles.cardHeaderText}>{topText}</Text>
      </View>
      <View style={styles.cardMainView}>
        <View style={styles.markView}>
          <Text style={styles.markNumberText}>{mark}</Text>
          <Text style={styles.markWordText}>баллов</Text>
        </View>
        <View>{component}</View>
      </View>
  </View>
);

export default CardSign;
