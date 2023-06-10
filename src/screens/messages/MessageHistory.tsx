import React from 'react';

import Screen from '../../components/Screen';
import Message from './Message';
import { IMessage } from '../../models/messages';
import { parseDate } from '../../parser/utils';

export default function MessageHistory({ route, navigation }) {
  const { data } = route.params;
  const [mainMessage] = data;
  const { author } = mainMessage;
  const [name1, name2, name3] = author.split(' ');
  const shortAuthor = `${name1} ${name2.charAt(0)}. ${name3.charAt(0)}.`;

  const compareMessages = (first: IMessage, second: IMessage) => {
    const time1 = parseDate(first.time);
    const time2 = parseDate(second.time);
    if (time1 < time2) return -1;
    if (time1 > time2) return 1;
    return 0;
  };

  return (
    <Screen
      headerText={shortAuthor}
      scrollHeader={false}
      onBackPageClick={() => navigation.navigate('Сообщения')}
      startScrollFromBottom
      disableRefresh
    >
      {data.sort(compareMessages).map((message) => (
        <Message message={message} key={message.time} />
      ))}
    </Screen>
  );
}
