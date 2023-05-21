import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import CardHeaderIn from '../../components/CardHeaderIn';

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
  },
  boldText: {
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
  },
});

function UserInfo({ data }) {
  const { name, speciality, educationForm, year, group } = data;

  return (
    <CardHeaderIn topText={name}>
      <View>
        <Text style={[styles.text, styles.boldText]}>Направление:</Text>
        <Text style={styles.text}>{speciality}</Text>

        <View style={styles.row}>
          <Text style={[styles.text, styles.boldText]}>Форма обучения: </Text>
          <Text style={styles.text}>
            {educationForm.charAt(0).toUpperCase() + educationForm.slice(1)}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={[styles.text, styles.boldText]}>Год: </Text>
          <Text style={styles.text}>{year}</Text>
        </View>

        <View style={styles.row}>
          <Text style={[styles.text, styles.boldText]}>Группа: </Text>
          <Text style={styles.text}>{group}</Text>
        </View>
      </View>
    </CardHeaderIn>
  );
}

export default UserInfo;
