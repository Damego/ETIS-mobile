import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import Card from '~/components/Card';
import Text from '~/components/Text';
import { useAppSelector } from '~/hooks';
import { capitalizeWord, fontSize } from '~/utils/texts';

function UserInfo() {
  const { name, speciality, educationForm, year, group } = useAppSelector(
    (state) => state.student.info
  );
  const nameTextStyle = useMemo(() => StyleSheet.compose(fontSize.medium, styles.boldText), []);

  return (
    <>
      <Card>
        <Text style={styles.cardTitle}>{name}</Text>
        {speciality && (
          <Text>
            <Text style={nameTextStyle}>
              Направление:{' '}
            </Text>
            <Text style={fontSize.medium}>
              {speciality}
            </Text>
          </Text>
        )}

        {educationForm && (
          <Text>
            <Text style={nameTextStyle}>
              Форма обучения:{' '}
            </Text>
            <Text style={fontSize.medium}>
              {capitalizeWord(educationForm)}
            </Text>
          </Text>
        )}

        {year && (
          <Text>
            <Text style={nameTextStyle}>
              Год:{' '}
            </Text>
            <Text style={fontSize.medium}>
              {year}
            </Text>
          </Text>
        )}

        <Text>
          <Text style={nameTextStyle}>
            Группа:{' '}
          </Text>
          <Text style={fontSize.medium}>
            {group}
          </Text>
        </Text>
      </Card>
    </>
  );
}

export default UserInfo;

const styles = StyleSheet.create({
  boldText: {
    fontWeight: 'bold',
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '500',
    marginBottom: '2%',
  },
});
