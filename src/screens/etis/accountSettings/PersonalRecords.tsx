import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import Card from '~/components/Card';
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
    <Card style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <View>
        <Text>
          {record.year} {record.speciality}
        </Text>
        {!showStatus && <Text>Статус: {record.status}</Text>}
      </View>
      {record.id && record.status === 'студент' && (
        <View>
          <TouchableOpacity onPress={changePersonalRecord}>
            <AntDesign name="select1" size={24} color={globalStyles.textColor.color} />
          </TouchableOpacity>
        </View>
      )}
    </Card>
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

  if (isLoading || !data) {
    return null;
  }

  const activeRecords = data.filter((record) => record.status === 'студент' && record.id);

  if (!activeRecords.length) {
    return null;
  }

  return (
    <View>
      <Text style={styles.cardTitle}>Личные записи</Text>
      <Text style={textStyles}>Доступные записи</Text>
      <View style={{ gap: 8 }}>
        {activeRecords.map((record) => (
          <PersonalRecord record={record} key={record.id + record.index} showStatus />
        ))}
      </View>
    </View>
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
