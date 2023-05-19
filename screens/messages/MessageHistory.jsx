import React, { useContext, useEffect, useState } from 'react';

import LoadingScreen from '../../components/LoadingScreen';
import Screen from '../../components/Screen';
import WarningCard from '../../components/WarningCard';
import AuthContext from '../../context/AuthContext';
import { parseTeacherMessages } from '../../parser';
import { isLoginPage } from '../../parser/utils';
import { httpClient } from '../../utils';
import MessagePreview from './MessagePreview';

const MessageHistory = () => {
  const { toggleSignIn } = useContext(AuthContext);
  const [data, setData] = useState();

  const loadData = async () => {
    const html = await httpClient.getTeacherNotes();
    if (!html) return;

    if (isLoginPage(html)) {
      toggleSignIn(true);
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
      <WarningCard text="🚧 Страница находится в разработке!" />

      {data.map((messageBlock) => (
        <MessagePreview data={messageBlock} key={messageBlock[0].time.format()} />
      ))}
    </Screen>
  );
};

export default MessageHistory;
