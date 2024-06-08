import { useIsFocused } from '@react-navigation/native';
import React, { useEffect } from 'react';

import Card from '~/components/Card';
import ClickableText from '~/components/ClickableText';
import LoadingScreen from '~/components/LoadingScreen';
import NoData from '~/components/NoData';
import Screen from '~/components/Screen';
import Text from '~/components/Text';
import { useClient } from '~/data/client';
import { useAppSelector } from '~/hooks';
import useQuery from '~/hooks/useQuery';
import { RequestType } from '~/models/results';
import { RootStackScreenProps } from '~/navigation/types';
import { fontSize } from '~/utils/texts';

export default function SessionQuestionnaireList({ navigation }: RootStackScreenProps) {
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
    if (!isLoading && isFocused) refresh();
  }, [isFocused]);

  if (isLoading) return <LoadingScreen />;
  if (!data) return <NoData onRefresh={refresh} />;

  const available = data.filter((link) => link.url);
  const passed = data.filter((link) => !link.url);

  return (
    <Screen>
      {available.length !== 0 && (
        <Text style={[fontSize.large, { fontWeight: '500', marginBottom: '2%' }]}>Доступные</Text>
      )}
      {available.map((link) => (
        <Card key={link.name}>
          <ClickableText
            text={link.name}
            onPress={() => {
              navigation.navigate('SessionQuestionnaire', { url: link.url });
            }}
            textStyle={fontSize.small}
            colorVariant={'block'}
          />
        </Card>
      ))}

      {passed.length !== 0 && (
        <Text style={[fontSize.large, { fontWeight: '500', marginBottom: '2%' }]}>Пройденные</Text>
      )}
      {passed.map((link) => (
        <Card key={link.name}>
          <Text style={fontSize.small} colorVariant={'block'}>
            {link.name}
          </Text>
        </Card>
      ))}
    </Screen>
  );
}
