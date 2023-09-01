import { useIsFocused } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Text, ToastAndroid, View } from 'react-native';

import Card from '../../components/Card';
import ClickableText from '../../components/ClickableText';
import LoadingScreen from '../../components/LoadingScreen';
import NoData from '../../components/NoData';
import Screen from '../../components/Screen';
import { useClient } from '../../data/client';
import { useAppDispatch, useAppSelector, useGlobalStyles } from '../../hooks';
import { GetResultType, RequestType } from '../../models/results';
import { ISessionQuestionnaireLink } from '../../models/sessionQuestionnaire';
import { setAuthorizing } from '../../redux/reducers/authSlice';
import { fontSize } from '../../utils/texts';

export default function SessionQuestionnaireList({ navigation }) {
  const globalStyles = useGlobalStyles();
  const [data, setData] = useState<ISessionQuestionnaireLink[]>();
  const [isLoading, setLoading] = useState(false);
  const { sessionTestID } = useAppSelector((state) => state.student);
  const dispatch = useAppDispatch();
  const client = useClient();
  const isFocused = useIsFocused();

  const loadData = async () => {
    setLoading(true);
    const result = await client.getSessionQuestionnaireList({
      requestType: RequestType.forceFetch,
      data: sessionTestID,
    });

    if (result.type === GetResultType.loginPage) {
      return dispatch(setAuthorizing(false));
    }

    if (!result.data) {
      setLoading(false);
      ToastAndroid.show('Нет данных для отображения', ToastAndroid.LONG);
      return;
    }

    setData(result.data);
    setLoading(false);
  };

  useEffect(() => {
    // Если пользователь пройдёт тест, то список не обновится при нажатии кнопки "назад"
    if (isFocused) loadData();
  }, [isFocused]);

  if (isLoading) return <LoadingScreen />;
  if (!data) return <NoData onRefresh={loadData} />;

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
                  navigation.navigate('SessionQuestionnaire', { url: link.url });
                }}
                textStyle={[globalStyles.textColor, fontSize.small]}
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
              <Text style={[globalStyles.textColor, fontSize.small]}>{link.name}</Text>
            </Card>
          ))}
      </View>
    </Screen>
  );
}
