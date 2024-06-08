import React from 'react';
import { StyleSheet } from 'react-native';

import CardHeaderIn from '~/components/CardHeaderIn';
import Text from '~/components/Text';
import { fontSize } from '~/utils/texts';

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
  if (!data) return;

  const { name, speciality, educationForm, year, group } = data;
  const nameTextStyle = [fontSize.medium, styles.boldText];

  return (
    <>
      <Text style={styles.textTitle}>Студент</Text>
      <CardHeaderIn topText={name}>
        {speciality && (
          <Text>
            <Text style={nameTextStyle} colorVariant={'block'}>
              Направление:{' '}
            </Text>
            <Text style={fontSize.medium} colorVariant={'block'}>
              {speciality}
            </Text>
          </Text>
        )}

        {educationForm && (
          <Text>
            <Text style={nameTextStyle} colorVariant={'block'}>
              Форма обучения:{' '}
            </Text>
            <Text style={fontSize.medium} colorVariant={'block'}>
              {educationForm.charAt(0).toUpperCase() + educationForm.slice(1)}
            </Text>
          </Text>
        )}

        {year && (
          <Text>
            <Text style={nameTextStyle} colorVariant={'block'}>
              Год:{' '}
            </Text>
            <Text style={fontSize.medium} colorVariant={'block'}>
              {year}
            </Text>
          </Text>
        )}

        <Text>
          <Text style={nameTextStyle} colorVariant={'block'}>
            Группа:{' '}
          </Text>
          <Text style={fontSize.medium} colorVariant={'block'}>
            {group}
          </Text>
        </Text>
      </CardHeaderIn>
    </>
  );
}

export default UserInfo;
