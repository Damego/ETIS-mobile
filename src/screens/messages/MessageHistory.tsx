import React, { useEffect, useRef, useState } from 'react';
import { ToastAndroid } from 'react-native';

import Screen from '../../components/Screen';
import { useClient } from '../../data/client';
import { useAppSelector } from '../../hooks';
import useQuery from '../../hooks/useQuery';
import { IMessage } from '../../models/messages';
import { UploadFile } from '../../models/other';
import { RequestType } from '../../models/results';
import { parseDate } from '../../parser/utils';
import { httpClient } from '../../utils';
import Message from './Message';
import MessageInput, { FilesPreview } from './MessageInput';

const formatTeacherName = (name: string): string => {
  const [name1, name2, name3] = name.split(' ');
  return `${name1} ${name2.charAt(0)}. ${name3.charAt(0)}.`;
};

const compareMessages = (first: IMessage, second: IMessage) => {
  const time1 = parseDate(first.time);
  const time2 = parseDate(second.time);
  if (time1 < time2) return -1;
  if (time1 > time2) return 1;
  return 0;
};

export default function MessageHistory({ route, navigation }) {
  const [messages, setMessages] = useState<IMessage[]>(route.params.data);
  const pageRef = useRef<number>(route.params.page);
  const [isUploading, setUploading] = useState<boolean>(false);
  const [files, setFiles] = useState<UploadFile[]>([]);
  const isDemo = useAppSelector((state) => state.auth.isDemo);

  const [firstMessage] = messages;
  const shortAuthor = formatTeacherName(firstMessage.author);

  const client = useClient();
  const query = useQuery({
    method: client.getMessagesData,
    skipInitialGet: true,
  });

  const loadData = async () => {
    const result = await query.get({ data: pageRef.current, requestType: RequestType.tryFetch });

    for (const messages of result.data.messages) {
      const [message] = messages;
      if (message.messageID === firstMessage.messageID) {
        setMessages(messages);
        return messages;
      }
    }
  };

  const onFileSelect = (fileData: UploadFile[]) => {
    if (!fileData) return;
    const uploadFiles = fileData.filter(
      (uploadFile) => !files.find((file) => file.name === uploadFile.name)
    );

    setFiles([...files, ...uploadFiles]);
  };

  const onFileRemove = (fileName: string) => {
    setFiles(files.filter((file) => file.name !== fileName));
  };

  const onSubmit = async (text: string) => {
    setUploading(true); // TODO: block replying on demo account
    const response = await httpClient.replyToMessage(firstMessage.answerID, text);

    if (response.error) {
      setUploading(false);
      ToastAndroid.show(response.error.message, ToastAndroid.SHORT);
      return response;
    }

    const messageBlock = await loadData();

    if (!messageBlock || files.length === 0) {
      setUploading(false);
      return;
    }
    const message = messageBlock.at(-1);

    for (const file of files) {
      await httpClient.attachFileToMessage(firstMessage.messageID, message.answerMessageID, file);
    }

    loadData();
    setFiles([]);
    setUploading(false);
  };

  useEffect(() => {
    navigation.setOptions({ title: shortAuthor });
  }, []);

  return (
    <>
      <Screen startScrollFromBottom>
        {messages.sort(compareMessages).map((message, index) => (
          <Message message={message} key={`${message.time}-${index}`} />
        ))}
      </Screen>
      {files.length !== 0 && <FilesPreview files={files} onFileRemove={onFileRemove} />}
      <MessageInput
        onFileSelect={onFileSelect}
        onSubmit={onSubmit}
        showLoading={isUploading}
        disabled={isDemo}
      />
    </>
  );
}
