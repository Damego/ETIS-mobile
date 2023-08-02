import React, { useRef, useState } from 'react';
import { setAuthorizing } from '../../redux/reducers/authSlice';
import { Text, ToastAndroid } from 'react-native';
import { useAppDispatch } from '../../hooks';
import { IRating } from '../../models/rating';
import LoadingScreen from '../../components/LoadingScreen';
import Screen from '../../components/Screen';
import { getWrappedClient } from '../../data/client';
import { GetResultType, RequestType } from '../../models/results';

export default function RatingPage() {
  const [data, setData] = useState<IRating>();
  const fetchedFirstTime = useRef<boolean>(false);
  const dispatch = useAppDispatch();
  const client = getWrappedClient();

  const loadData = async ({ session, force }: { session: number; force: boolean }) => {
    const useCacheFirst = !force && fetchedFirstTime.current;
    const result = await client.getRatingData({
      requestType: useCacheFirst ? RequestType.tryCache : RequestType.tryFetch,
      session,
    });

    if (result.type === GetResultType.loginPage) {
      dispatch(setAuthorizing(true));
      return;
    }
    if (!result.data) {
      ToastAndroid.show('Упс... Нет данных для отображения', ToastAndroid.LONG);
      return;
    }

    setData(result.data);
  };

  if (!data) {
    return <LoadingScreen />;
  }

  return (
    <Screen>
      <Text>Тест</Text>
    </Screen>
  );
}
