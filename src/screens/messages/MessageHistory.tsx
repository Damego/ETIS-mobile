import React, { useEffect, useRef, useState } from 'react';
import { ToastAndroid } from 'react-native';

import Screen from '../../components/Screen';
import { getWrappedClient } from '../../data/client';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { IMessage } from '../../models/messages';
import { UploadFile } from '../../models/other';
import { GetResultType, RequestType } from '../../models/results';
import { parseDate } from '../../parser/utils';
import { setAuthorizing } from '../../redux/reducers/authSlice';
import { httpClient } from '../../utils';
import Message from './Message';
import MessageInput, { FilesPreview } from './MessageInput';

export default function MessageHistory({ route, navigation }) {
  const [data, setData] = useState<IMessage[]>(route.params.data);
  const pageRef = useRef<number>(route.params.page);
  const [isUploading, setUploading] = useState<boolean>(false);
  const isDemo = useAppSelector((state) => state.auth.isDemo);
  const dispatch = useAppDispatch();

  const [mainMessage] = data;
  const { author } = mainMessage;
  const [name1, name2, name3] = author.split(' ');
  const shortAuthor = `${name1} ${name2.charAt(0)}. ${name3.charAt(0)}.`;

  const [files, setFiles] = useState<UploadFile[]>([]);
  const client = getWrappedClient();
  const loadData = async () => {
    const result = await client.getMessagesData({
      page: pageRef.current,
      requestType: RequestType.tryFetch,
    });

    if (result.type === GetResultType.loginPage) {
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

  const onFileSelect = (fileData: UploadFile[]) => {
    if (!fileData) return;
    const uploadFiles = fileData.filter(
      (uploadFile) => !files.find((file) => file.name === uploadFile.name)
    );

    setFiles([...files, ...uploadFiles]);
  };

  const onFileRemove = (fileName) => {
    setFiles(files.filter((file) => file.name !== fileName));
  };

  const onSubmit = async (text: string) => {
    setUploading(true); // TODO: block replying on demo account
    const response = await httpClient.replyToMessage(mainMessage.answerID, text);

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
      await httpClient.attachFileToMessage(mainMessage.messageID, message.answerMessageID, file);
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
        {data.sort(compareMessages).map((message, index) => (
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
