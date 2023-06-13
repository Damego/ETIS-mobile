import React, { useRef, useState } from 'react';

import Screen from '../../components/Screen';
import { IMessage } from '../../models/messages';
import { parseDate } from '../../parser/utils';
import { httpClient } from '../../utils';
import Message from './Message';
import MessageInput, { FilesPreview } from './MessageInput';
import { getMessagesData } from '../../data/messages';
import { setAuthorizing } from '../../redux/reducers/authSlice';
import { useAppDispatch } from '../../hooks';

export default function MessageHistory({ route, navigation }) {
  const dispatch = useAppDispatch();
  const [data, setData] = useState<IMessage[]>(route.params.data);
  const pageRef = useRef<number>(route.params.page);
  const [isUploading, setUploading] = useState<boolean>(false);

  const [mainMessage] = data;
  const { author } = mainMessage;
  const [name1, name2, name3] = author.split(' ');
  const shortAuthor = `${name1} ${name2.charAt(0)}. ${name3.charAt(0)}.`;

  const [files, setFiles] = useState([]);

  const loadData = async () => {
    const result = await getMessagesData({
      page: pageRef.current,
      useCache: true,
      useCacheFirst: false
    });

    if (result.isLoginPage) {
      dispatch(setAuthorizing(true));
      return;
    }

    for (const messageBlock of result.data.messages) {
      const [mainMsg] = messageBlock;
      if (mainMsg.messageID === mainMessage.messageID) {
        setData(messageBlock);
        return messageBlock;
      }
    }
  };

  const compareMessages = (first: IMessage, second: IMessage) => {
    const time1 = parseDate(first.time);
    const time2 = parseDate(second.time);
    if (time1 < time2) return -1;
    if (time1 > time2) return 1;
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

  const onSubmit = async (text: string) => {
    setUploading(true)
    await httpClient.replyToMessage(mainMessage.answerID, text);
    const messageBlock = await loadData();

    if (!messageBlock || files.length === 0) return;
    const message = messageBlock.at(-1);

    for (const file of files) {
      await httpClient.attachFileToMessage(mainMessage.messageID, message.answerMessageID, file);
    }

    loadData();
    setFiles([]);
    setUploading(false)
  };

  return (
    <>
      <Screen
        headerText={shortAuthor}
        scrollHeader={false}
        onBackPageClick={() => navigation.navigate('Сообщения')}
        startScrollFromBottom
        disableRefresh
      >
        {data.sort(compareMessages).map((message, index) => (
          <Message message={message} key={`${message.time}-${index}`} />
        ))}
      </Screen>
      {files.length !== 0 && <FilesPreview files={files} onFileRemove={onFileRemove} />}
      <MessageInput
        onFileSelect={onFileSelect}
        onSubmit={onSubmit}
        showLoading={isUploading}
      />
    </>
  );
}
