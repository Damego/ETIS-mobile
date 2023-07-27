import React, { useRef, useState } from 'react';
import { getRatingData } from '../../data/rating';
import { setAuthorizing } from '../../redux/reducers/authSlice';
import { Text, ToastAndroid } from 'react-native';
import { useAppDispatch } from '../../hooks';
import { IRating } from '../../models/rating';
import LoadingScreen from '../../components/LoadingScreen';
import Screen from '../../components/Screen';

export default function RatingPage() {
  const [data, setData] = useState<IRating>()
  const fetchedFirstTime = useRef<boolean>(false);
  const dispatch = useAppDispatch()

  const loadData = async ({session, force}: {session: number, force: boolean}) => {
    const result = await getRatingData({useCache: true, useCacheFirst: !force && fetchedFirstTime.current, session});

    if (result.isLoginPage) {
      dispatch(setAuthorizing(true));
      return;
    }
    if (!result.data) {
      ToastAndroid.show('Упс... Нет данных для отображения', ToastAndroid.LONG);
      return;
    }

    setData(result.data);
  }

  if (!data) {
    return <LoadingScreen />
  }

  return (
    <Screen>
      <Text>Тест</Text>
    </Screen>
  )
}