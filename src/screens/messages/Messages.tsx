import React, { useEffect, useState } from 'react';

import LoadingScreen from '../../components/LoadingScreen';
import PageNavigator from '../../components/PageNavigator';
import Screen from '../../components/Screen';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { MessagesData } from '../../models/messages';
import { parseTeacherMessages } from '../../parser';
import { isLoginPage } from '../../parser/utils';
import { setAuthorizing } from '../../redux/reducers/authSlice';
import { httpClient } from '../../utils';
import MessagePreview from './MessagePreview';

const Messages = () => {
  const dispatch = useAppDispatch();
  const { isAuthorizing } = useAppSelector((state) => state.auth);
  const [data, setData] = useState<MessagesData>();

  const loadData = async (page?: number) => {
    const html = await httpClient.getMessages(page);
    if (!html) return;

    if (isLoginPage(html)) {
      dispatch(setAuthorizing(true));
      return;
    }

    setData(parseTeacherMessages(html));
  };

  useEffect(() => {
    if (!isAuthorizing) loadData();
  }, [isAuthorizing]);

  if (!data) return <LoadingScreen />;

  return (
    <Screen onUpdate={loadData}>
      <PageNavigator
        firstPage={1}
        lastPage={data.lastPage}
        currentPage={data.page}
        onPageChange={(page) => loadData(page)}
      />

      {data.messages.map((messageBlock) => (
        <MessagePreview data={messageBlock} key={messageBlock[0].time} />
      ))}
    </Screen>
  );
};

export default Messages;
