import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  cardView: {
    flex: 1,
    display: 'flex',
    width: '96%',
    backgroundColor: '#ffffff',
    marginLeft: '2%',
    marginBottom: '3%',
    borderRadius: 10,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 4,
  },
  cardHeaderView: {
    marginLeft: '2%',
    marginBottom: 4,
  },
  cardHeaderText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

const Card = ({ topText, component }) => (
  <View>
    <View style={styles.cardHeaderView}>
      <Text style={styles.cardHeaderText}>{topText}</Text>
    </View>
    <View style={styles.cardView}>{component}</View>
  </View>
);

export default Card;
