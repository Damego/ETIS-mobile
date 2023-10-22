import React from 'react';
import { StyleSheet, Text } from 'react-native';

import CardHeaderIn from '../../components/CardHeaderIn';
import { useGlobalStyles } from '../../hooks';
import { fontSize } from '../../utils/texts';

const styles = StyleSheet.create({
  boldText: {
    fontWeight: 'bold',
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
        {speciality && (
          <Text>
            <Text style={nameTextStyle}>Направление: </Text>
            <Text style={textStyle}>{speciality}</Text>
          </Text>
        )}

        {educationForm && (
          <Text>
            <Text style={nameTextStyle}>Форма обучения: </Text>
            <Text style={textStyle}>
              {educationForm.charAt(0).toUpperCase() + educationForm.slice(1)}
            </Text>
          </Text>
        )}

        {year && (
          <Text>
            <Text style={nameTextStyle}>Год: </Text>
            <Text style={textStyle}>{year}</Text>
          </Text>
        )}

        <Text>
          <Text style={nameTextStyle}>Группа: </Text>
          <Text style={textStyle}>{group}</Text>
        </Text>
      </CardHeaderIn>
    </>
  );
}

export default UserInfo;
