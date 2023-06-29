import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import CardHeaderIn from '../../components/CardHeaderIn';
import { useGlobalStyles } from '../../hooks';
import { fontSize } from '../../utils/texts';

const styles = StyleSheet.create({
  boldText: {
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
  },
  textTitle: {
    ...fontSize.large,
    fontWeight: '600',
    marginBottom: '2%',
  },
});

function UserInfo({ data }) {
  const globalStyles = useGlobalStyles();

  if (!data) return;

  const { name, speciality, educationForm, year, group } = data;
  const nameTextStyle = [fontSize.medium, styles.boldText, globalStyles.textColor];
  const textStyle = [fontSize.medium, globalStyles.textColor];

  return (
    <>
      <Text style={[styles.textTitle, globalStyles.textColor]}>Студент</Text>
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
    </>
  );
}

export default UserInfo;
