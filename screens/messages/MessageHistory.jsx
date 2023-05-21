import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import LoadingScreen from '../../components/LoadingScreen';
import Screen from '../../components/Screen';
import { parseTeacherMessages } from '../../parser';
import { isLoginPage } from '../../parser/utils';
import { httpClient } from '../../utils';
import MessagePreview from './MessagePreview';
import { signOut } from '../../redux/authSlice';

const MessageHistory = () => {
  const dispatch = useDispatch();
  const [data, setData] = useState();

  const loadData = async () => {
    const html = await httpClient.getTeacherNotes();
    if (!html) return;

    if (isLoginPage(html)) {
      dispatch(signOut({ autoAuth: true }));
      return;
    }

    setData(parseTeacherMessages(html));
  };

  useEffect(() => {
    loadData();
  }, []);

  if (!data) return <LoadingScreen headerText="Сообщения" />;

  return (
    <Screen headerText="Сообщения" onUpdate={loadData}>
      {data.map((messageBlock) => (
        <MessagePreview data={messageBlock} key={messageBlock[0].time.format()} />
      ))}
    </Screen>
  );
};

export default MessageHistory;
