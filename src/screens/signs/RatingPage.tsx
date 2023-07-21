import React, { useRef } from 'react';
import { getRatingData } from '../../data/rating';
import { setAuthorizing } from '../../redux/reducers/authSlice';
import { ToastAndroid } from 'react-native';
import { useAppDispatch } from '../../hooks';

export default function RatingPage() {
  const [fetchedFirstTime, setFetchedFirstTime] = useRef<boolean>(false);
  const dispatch = useAppDispatch()

  const loadData = async ({session, force}: {session: number, force: boolean}) => {
    const result = await getRatingData({useCache: true, useCacheFirst: fetchedFirstTime, session});

    if (result.isLoginPage) {
      dispatch(setAuthorizing(true));
      return;
    }
    if (!result.data) {
      ToastAndroid.show('Упс... Нет данных для отображения', ToastAndroid.LONG);
      return;
    }
  }
}