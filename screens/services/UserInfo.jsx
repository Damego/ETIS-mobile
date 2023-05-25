import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import CardHeaderIn from '../../components/CardHeaderIn';
import { useGlobalStyles } from '../../hooks';

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
  const globalStyles = useGlobalStyles();

  const { name, speciality, educationForm, year, group } = data;
  const nameTextStyle = [styles.text, styles.boldText, globalStyles.textColor];
  const textStyle = [styles.text, globalStyles.textColor];

  return (
    <CardHeaderIn topText={name}>
      <View>
        <Text style={nameTextStyle}>Направление:</Text>
        <Text style={textStyle}>{speciality}</Text>

        <View style={styles.row}>
          <Text style={nameTextStyle}>Форма обучения: </Text>
          <Text style={textStyle}>
            {educationForm.charAt(0).toUpperCase() + educationForm.slice(1)}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={nameTextStyle}>Год: </Text>
          <Text style={textStyle}>{year}</Text>
        </View>

        <View style={styles.row}>
          <Text style={nameTextStyle}>Группа: </Text>
          <Text style={textStyle}>{group}</Text>
        </View>
      </View>
    </CardHeaderIn>
  );
}

export default UserInfo;
