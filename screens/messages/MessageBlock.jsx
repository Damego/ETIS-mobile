import React, { useContext, useState } from 'react';

import Screen from '../../components/Screen';
import AuthContext from '../../context/AuthContext';
import { httpClient, parser } from '../../utils';
import Message from './Message';
import MessageFiles from './MessageFiles';
import MessageInput from './MessageInput';

export default function MessageBlock({ route, navigation }) {
  const { toggleSignIn } = useContext(AuthContext);

  const [data, setData] = useState(route.params.data);
  const [files, setFiles] = useState([]);
  const [messageText, setMessageText] = useState();

  const [mainMessage] = data;
  const { author, answerID, messageID } = mainMessage;
  const [name1, name2, name3] = author.split(' ');
  const shortAuthor = `${name1} ${name2.charAt(0)}. ${name3.charAt(0)}.`;

  const loadData = async () => {
    const html = await httpClient.getTeacherNotes();
    if (!html) return;
    if (parser.isLoginPage(html)) {
      toggleSignIn(true);
      return;
    }

    const allMessages = parser.parseTeacherNotes(html);
    for (const messageBlock of allMessages) {
      const [mainMsg] = messageBlock;
      if (mainMsg.messageID === messageID) {
        setData(messageBlock);
        return messageBlock;
      }
    }
  };

  const changeMessageText = (text) => {
    setMessageText(text);
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

  const onSubmit = async () => {
    await httpClient.replyToMessage(answerID, messageText);

    const messageBlock = await loadData();
    if (!messageBlock || files.length === 0) return;

    const replyMessage = messageBlock.at(1);
    await httpClient.attachFilesToMessage(messageID, replyMessage.answerMessageID, files);

    setFiles([]);
  };

  return (
    <>
      <Screen
        headerText={shortAuthor}
        scrollHeader={false}
        onBackPageClick={() => navigation.navigate('Все сообщения')}
        startScrollFromBottom
        onUpdate={loadData}
      >
        {data.sort(compareMessages).map((message) => (
          <Message data={message} key={message.time.format()} />
        ))}
      </Screen>

      {files.length !== 0 && <MessageFiles files={files} onFileRemove={onFileRemove} />}
      <MessageInput
        onFileSelect={onFileSelect}
        onChangeText={changeMessageText}
        value={messageText}
        onSubmit={onSubmit}
      />
    </>
  );
}
