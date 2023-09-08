import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Text, ToastAndroid, TouchableOpacity, View } from 'react-native';

import { cache } from '../../cache/smartCache';
import Card from '../../components/Card';
import Screen from '../../components/Screen';
import { useAppDispatch, useGlobalStyles } from '../../hooks';
import { IPersonalRecord } from '../../models/personalRecords';
import { resetForRecord } from '../../redux/reducers/studentSlice';
import { httpClient } from '../../utils';

const PersonalRecord = ({ record }: { record: IPersonalRecord }) => {
  const globalStyles = useGlobalStyles();
  const navigation = useNavigation();
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
    <Card style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <View>
        <Text style={globalStyles.textColor}>
          {record.year} {record.speciality}
        </Text>
      </View>
      {record.id && (
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

  const personalRecords = cache.personalRecords.get();
  const currentRecord = personalRecords.find((record) => !record.id);
  const activeRecords = personalRecords.filter(
    (record) => record.status === 'студент' && record.id
  );
  const inactiveRecords = personalRecords.filter(
    (record) => record.status !== 'студент' && record.id
  );

  return (
    <Screen>
      <Text style={globalStyles.textColor}>Текущая запись</Text>
      <PersonalRecord record={currentRecord} />

      <Text style={globalStyles.textColor}>Активные записи</Text>
      {activeRecords.map((record) => (
        <PersonalRecord record={record} key={record.id + record.index} />
      ))}

      <Text style={globalStyles.textColor}>Неактивные записи</Text>
      {inactiveRecords.map((record) => (
        <PersonalRecord record={record} key={record.id + record.index} />
      ))}
    </Screen>
  );
}
