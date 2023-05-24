import React from 'react';
import { StyleSheet, View } from 'react-native';


const styles = StyleSheet.create({
  cardView: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: '2%',
    marginBottom: '2%',
    borderWidth: 1,
    borderColor: '#eaeaea'
  },
});

const Card = ({ children }) => {
  return <View style={styles.cardView}>{children}</View>;
};

export default Card;
