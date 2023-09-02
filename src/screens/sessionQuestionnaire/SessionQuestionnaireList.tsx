import { useIsFocused } from '@react-navigation/native';
import { useEffect } from 'react';
import { Text, View } from 'react-native';

import Card from '../../components/Card';
import ClickableText from '../../components/ClickableText';
import LoadingScreen from '../../components/LoadingScreen';
import NoData from '../../components/NoData';
import Screen from '../../components/Screen';
import { useClient } from '../../data/client';
import { useAppSelector, useGlobalStyles } from '../../hooks';
import useQuery from '../../hooks/useQuery';
import { RequestType } from '../../models/results';
import { fontSize } from '../../utils/texts';

export default function SessionQuestionnaireList({ navigation }) {
  const globalStyles = useGlobalStyles();
  const { sessionTestID } = useAppSelector((state) => state.student);
  const client = useClient();
  const { data, isLoading, refresh } = useQuery({
    method: client.getSessionQuestionnaireList,
    payload: {
      requestType: RequestType.forceFetch,
      data: sessionTestID,
    },
  });
  const isFocused = useIsFocused();

  useEffect(() => {
    // Если пользователь пройдёт тест, то список не обновится при нажатии кнопки "назад"
    if (isFocused) refresh();
  }, [isFocused]);

  if (isLoading) return <LoadingScreen />;
  if (!data) return <NoData onRefresh={refresh} />;

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
