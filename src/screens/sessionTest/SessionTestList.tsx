import { useEffect, useState } from 'react';
import { Text, ToastAndroid, View } from 'react-native';

import Card from '../../components/Card';
import ClickableText from '../../components/ClickableText';
import LoadingScreen from '../../components/LoadingScreen';
import Screen from '../../components/Screen';
import { getWrappedClient } from '../../data/client';
import { useAppDispatch, useAppSelector, useGlobalStyles } from '../../hooks';
import { GetResultType } from '../../models/results';
import { ISessionTestLink } from '../../models/sessionTest';
import { setAuthorizing } from '../../redux/reducers/authSlice';
import { fontSize } from '../../utils/texts';

export default function SessionTestList({ navigation }) {
  const globalStyles = useGlobalStyles();
  const [data, setData] = useState<ISessionTestLink[]>();
  const { sessionTestID } = useAppSelector((state) => state.student);
  const dispatch = useAppDispatch();
  const client = getWrappedClient();

  const loadData = async () => {
    const result = await client.getSessionTestList(sessionTestID);

    if (result.type === GetResultType.loginPage) {
      return dispatch(setAuthorizing(false));
    }

    if (!result.data) {
      ToastAndroid.show('Упс... Нет данных для отображения', ToastAndroid.LONG);
      return;
    }

    setData(result.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  if (!data) {
    return <LoadingScreen />;
  }

  return (
    <Screen>
      <View>
        <Text style={[globalStyles.textColor, fontSize.large, { fontWeight: '500' }]}>
          Доступные
        </Text>
        {data
          .filter((link) => link.url)
          .map((link) => (
            <Card key={link.name}>
              <ClickableText
                text={link.name}
                onPress={() => {
                  navigation.navigate('SessionTest', { url: link.url });
                }}
              />
            </Card>
          ))}
        <Text style={[globalStyles.textColor, fontSize.large, { fontWeight: '500' }]}>
          Пройденные
        </Text>
        {data
          .filter((link) => !link.url)
          .map((link) => (
            <Card key={link.name}>
              <Text>{link.name}</Text>
            </Card>
          ))}
      </View>
    </Screen>
  );
}
