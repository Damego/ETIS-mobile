import React from 'react';

import Screen from '../../components/Screen';
import Message from './Message';

export default function MessageBlock({ route, navigation }) {
  const { data } = route.params;
  const [name1, name2, name3] = data[0].author.split(' ');
  const author = `${name1} ${name2.charAt(0)}. ${name3.charAt(0)}.`;

  const compareMessages = (first, second) => {
    if (first.time < second.time) return -1
    if (first.time > second.time) return 1;
    return 0
  }

  return (
    <Screen headerText={author} onBackPageClick={() => navigation.navigate('Все сообщения')}>
      {data.sort(compareMessages).map((message) => (
        <Message data={message} key={message.time.format()} />
      ))}
    </Screen>
  );
}
