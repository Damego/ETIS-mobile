import React, { useEffect, useState } from 'react';

import LoadingScreen from '../../components/LoadingScreen';
import Screen from '../../components/Screen';
import WarningCard from '../../components/WarningCard';
import { httpClient, parser } from '../../utils';
import MessageBlock from './MessageBlock';

const Messages = () => {
  const [data, setData] = useState();

  const loadData = async () => {
    const html = await httpClient.getTeacherNotes();
    if (!html) return;

    setData(parser.parseTeacherNotes(html));
  };

  useEffect(() => {
    loadData();
  }, []);

  if (!data) return <LoadingScreen headerText="Сообщения" />;

  return (
    <Screen headerText="Сообщения" onUpdate={loadData}>
      <WarningCard text="🚧 Страница находится в разработке!" />

      {data.map((messageBlock) => (
        <MessageBlock data={messageBlock} key={messageBlock[0].time} />
      ))}
    </Screen>
  );
};

export default Messages;
