import React, { useEffect, useState } from 'react';

import LoadingScreen from '../../components/LoadingScreen';
import Screen from '../../components/Screen';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { parseTeacherMessages } from '../../parser';
import { isLoginPage } from '../../parser/utils';
import { setAuthorizing } from '../../redux/reducers/authSlice';
import { httpClient } from '../../utils';
import MessagePreview from './MessagePreview';

const MessageHistory = () => {
  const dispatch = useAppDispatch();
  const { isAuthorizing } = useAppSelector((state) => state.auth);
  const [data, setData] = useState();

  const loadData = async () => {
    const html = await httpClient.getTeacherNotes();
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
      {data.map((messageBlock) => (
        <MessagePreview data={messageBlock} key={messageBlock[0].time.format()} />
      ))}
    </Screen>
  );
};

export default MessageHistory;
