import React from 'react';

import Screen from '../../components/Screen';
import Message from './Message';

export default function MessageBlock({ route, navigation }) {
  const { data } = route.params;
  const [mainMessage] = data;
  const { author } = mainMessage;
  const [name1, name2, name3] = author.split(' ');
  const shortAuthor = `${name1} ${name2.charAt(0)}. ${name3.charAt(0)}.`;

  const compareMessages = (first, second) => {
    if (first.time < second.time) return -1;
    if (first.time > second.time) return 1;
    return 0;
  };

  return (
    <Screen
      headerText={shortAuthor}
      scrollHeader={false}
      onBackPageClick={() => navigation.navigate('Все сообщения')}
      startScrollFromBottom
      disableRefresh
    >
      {data.sort(compareMessages).map((message) => (
        <Message data={message} key={message.time.format()} />
      ))}
    </Screen>
  );
}
