import React, { useEffect, useRef, useState } from 'react';
import { ToastAndroid } from 'react-native';

import LoadingScreen from '../../components/LoadingScreen';
import PageNavigator from '../../components/PageNavigator';
import Screen from '../../components/Screen';
import { getMessagesData } from '../../data/messages';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { IMessagesData } from '../../models/messages';
import { setAuthorizing } from '../../redux/reducers/authSlice';
import { setMessageCount } from '../../redux/reducers/studentSlice';
import MessagePreview from './MessagePreview';

const Messages = () => {
  const dispatch = useAppDispatch();
  const { isAuthorizing } = useAppSelector((state) => state.auth);
  const [data, setData] = useState<IMessagesData>();
  const fetchedPages = useRef<number[]>([]);

  const loadData = async ({ page, force }: { page?: number; force?: boolean }) => {
    if (page === undefined) page = 1;

    const result = await getMessagesData({
      page,
      useCache: true,
      useCacheFirst: !force && fetchedPages.current.includes(page),
    });

    if (result.isLoginPage) {
      dispatch(setAuthorizing(true));
      return;
    }

    if (!result.data) {
      ToastAndroid.show('Упс... Нет данных для отображения', ToastAndroid.LONG);
      return;
    }

    setData(result.data);

    if (!fetchedPages.current.includes(result.data.page)) {
      fetchedPages.current.push(result.data.page);
    }
  };

  useEffect(() => {
    if (!isAuthorizing) loadData({});
  }, [isAuthorizing]);

  useEffect(() => {
    dispatch(setMessageCount(null));
  }, []);

  if (!data) return <LoadingScreen onRefresh={() => loadData({})} />;

  return (
    <Screen onUpdate={() => loadData({ force: true })}>
      <PageNavigator
        firstPage={1}
        lastPage={data.lastPage}
        currentPage={data.page}
        onPageChange={(page) => loadData({ page })}
      />

      {data.messages.map((messageBlock) => (
        <MessagePreview data={messageBlock} key={messageBlock[0].time} page={data.page} />
      ))}
    </Screen>
  );
};

export default Messages;
