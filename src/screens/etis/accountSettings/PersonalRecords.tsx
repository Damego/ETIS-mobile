import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleProp, StyleSheet, TextStyle, ToastAndroid, TouchableOpacity, View } from 'react-native';

import Card from '~/components/Card';
import LoadingScreen, { LoadingContainer } from '~/components/LoadingScreen';
import Screen from '~/components/Screen';
import Text from '~/components/Text';
import { useClient } from '~/data/client';
import { useAppDispatch, useGlobalStyles } from '~/hooks';
import useQuery from '~/hooks/useQuery';
import { IPersonalRecord } from '~/models/personalRecords';
import { RootStackNavigationProp } from '~/navigation/types';
import { resetForRecord } from '~/redux/reducers/studentSlice';
import { httpClient } from '~/utils';
import { fontSize } from '~/utils/texts';

const PersonalRecord = ({
  record,
  showStatus,
}: {
  record: IPersonalRecord;
  showStatus: boolean;
}) => {
  const globalStyles = useGlobalStyles();
  const navigation = useNavigation<RootStackNavigationProp>(); // what?
  const dispatch = useAppDispatch();

  const changePersonalRecord = async () => {
    const success = await httpClient.changePersonalRecord(record.id);
    if (!success) {
      return ToastAndroid.show('Невозможно сменить личную запись', ToastAndroid.LONG);
    }

    dispatch(resetForRecord());
    navigation.reset({ index: 0, routes: [{ name: 'TabNavigator' }] });
  };

  return (
    <>
      <View>
        <Text colorVariant={'text2'}>
          {record.year} {record.speciality}
        </Text>
        {!showStatus && <Text colorVariant={'text2'}>Статус: {record.status}</Text>}
      </View>
      {record.id && record.status === 'студент' && (
        <View>
          <TouchableOpacity onPress={changePersonalRecord}>
            <AntDesign name="select1" size={24} color={globalStyles.textColor2.color} />
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

export default function PersonalRecords() {
  const globalStyles = useGlobalStyles();
  const textStyles: StyleProp<TextStyle> = [
    globalStyles.textColor,
    fontSize.medium,
    { fontWeight: '500', marginBottom: '2%' },
  ];

  const client = useClient();
  const { data, isLoading } = useQuery({
    method: client.getPersonalRecords,
  });

  if (isLoading) {
    return null;
  }

  const activeRecords = data.filter((record) => record.status === 'студент' && record.id);

  if (!activeRecords.length) {
    return null;
  }

  return (
    <Card>
      <Text style={styles.cardTitle}>Личные записи</Text>
      <Text style={textStyles}>Доступные записи</Text>
      {activeRecords.map((record) => (
        <PersonalRecord record={record} key={record.id + record.index} showStatus />
      ))}
    </Card>
  );
}

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
