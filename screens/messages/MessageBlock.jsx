import React, { useRef, useState } from 'react';

import Screen from '../../components/Screen';
import Message from './Message';
import MessageFiles from './MessageFiles';
import MessageInput from './MessageInput';

export default function MessageBlock({ route, navigation }) {
  const { data } = route.params;
  const messageText = useRef();
  const [files, setFiles] = useState([{name: 'test.png'}]);
  const [name1, name2, name3] = data[0].author.split(' ');
  const author = `${name1} ${name2.charAt(0)}. ${name3.charAt(0)}.`;

  const changeMessageText = (text) => {
    messageText.current = text;
  };

  const compareMessages = (first, second) => {
    if (first.time < second.time) return -1;
    if (first.time > second.time) return 1;
    return 0;
  };

  const onFileSelect = (fileData) => {
    if (files.map((file) => file.name).includes(fileData.name)) return;

    const file = {
      name: fileData.name,
      size: fileData.size,
      uri: fileData.uri,
      type: fileData.mimeType,
    };

    setFiles([...files, file]);
  };

  const onFileRemove = (fileName) => {
    setFiles(files.filter((file) => file.name !== fileName));
  };

  return (
    <>
      <Screen
        headerText={author}
        scrollHeader={false}
        onBackPageClick={() => navigation.navigate('Все сообщения')}
      >
        {data.sort(compareMessages).map((message) => (
          <Message data={message} key={message.time.format()} />
        ))}
      </Screen>

      {files.length !== 0 && <MessageFiles files={files} onFileRemove={onFileRemove} />}
      <MessageInput
        onFileSelect={onFileSelect}
        onChangeText={changeMessageText}
        value={messageText.current}
      />
    </>
  );
}
