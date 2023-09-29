import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StyleProp, Text, TextStyle, ToastAndroid, TouchableOpacity, View } from 'react-native';

import Card from '../../components/Card';
import LoadingScreen from '../../components/LoadingScreen';
import Screen from '../../components/Screen';
import { useClient } from '../../data/client';
import { useAppDispatch, useGlobalStyles } from '../../hooks';
import useQuery from '../../hooks/useQuery';
import { IPersonalRecord } from '../../models/personalRecords';
import { resetForRecord } from '../../redux/reducers/studentSlice';
import { httpClient } from '../../utils';
import { fontSize } from '../../utils/texts';

const PersonalRecord = ({
  record,
  showStatus,
}: {
  record: IPersonalRecord;
  showStatus: boolean;
}) => {
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
        {!showStatus && <Text style={globalStyles.textColor}>Статус: {record.status}</Text>}
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
    return <LoadingScreen />;
  }

  const currentRecord = data.find((record) => !record.id);
  const activeRecords = data.filter((record) => record.status === 'студент' && record.id);
  const inactiveRecords = data.filter((record) => record.status !== 'студент' && record.id);

  return (
    <Screen>
      <Text
        style={[globalStyles.textColor, fontSize.medium, { fontWeight: '500', marginBottom: '2%' }]}
      >
        Текущая запись
      </Text>
      <PersonalRecord record={currentRecord} showStatus={true} />

      {activeRecords.length !== 0 && <Text style={textStyles}>Активные записи</Text>}
      {activeRecords.map((record) => (
        <PersonalRecord record={record} key={record.id + record.index} showStatus={true} />
      ))}

      {inactiveRecords.length !== 0 && <Text style={textStyles}>Неактивные записи</Text>}
      {inactiveRecords.map((record) => (
        <PersonalRecord record={record} key={record.id + record.index} showStatus={false} />
      ))}
    </Screen>
  );
}
