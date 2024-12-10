import { ListRenderItemInfo } from '@shopify/flash-list';
import { useNavigation } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ToastAndroid, View } from 'react-native';
import { ListScreen } from '~/components/Screen';
import Message from '~/components/education/messageHistory/Message';
import MessageInput, { FilesPreview } from '~/components/education/messageHistory/MessageInput';
import { useClient } from '~/data/client';
import { useAppSelector } from '~/hooks';
import useQuery from '~/hooks/useQuery';
import useRoutePayload from '~/hooks/useRoutePayload';
import { IMessage } from '~/models/messages';
import { UploadFile } from '~/models/other';
import { IGetPayload, RequestType } from '~/models/results';
import { parseDatetime } from '~/parser/utils';
import { httpClient } from '~/utils';

const formatTeacherName = (name: string): string => {
  const [firstName, ...otherNames] = name.split(' ');
  const otherNameLetters = otherNames.map((name) => `${name.charAt(0)}.`).join(' ');
  return `${firstName} ${otherNameLetters}`;
};

const compareMessages = (first: IMessage, second: IMessage) => {
  const time1 = parseDatetime(first.time);
  const time2 = parseDatetime(second.time);
  if (time1 < time2) return -1;
  if (time1 > time2) return 1;
  return 0;
};

const findMessageBlockById = (messages: IMessage[][], messageId: string) =>
  messages.find((messageBlock) => messageBlock.find((message) => message.messageID === messageId));

export default function MessageHistory() {
  const navigation = useNavigation();
  const { data, page } = useRoutePayload<{ data: IMessage[]; page: number }>();
  const [messages, setMessages] = useState<IMessage[]>(data);
  const pageRef = useRef<number>(page);
  const [isUploading, setUploading] = useState<boolean>(false);
  const [files, setFiles] = useState<UploadFile[]>([]);
  const isDemo = useAppSelector((state) => state.account.isDemo);

  const [firstMessage] = messages;
  const shortAuthor = formatTeacherName(firstMessage.author);

  const client = useClient();
  const query = useQuery({
    method: client.getMessagesData,
    skipInitialGet: true,
  });

  const loadData = async () => {
    const payload: IGetPayload<number> = {
      requestType: RequestType.forceFetch,
    };
    if (pageRef.current) {
      payload.data = pageRef.current;
    }

    const result = await query.get(payload);

    if (!result.data) {
      ToastAndroid.show(
        'Не удалось обновить сообщения. Проверьте интернет-соединение',
        ToastAndroid.LONG
      );
      return;
    }

    const $messages = findMessageBlockById(result.data.messages, firstMessage.messageID);
    setMessages($messages);
    return $messages;
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
    if (isDemo) {
      ToastAndroid.show('Отправка сообщение в демо невозможна', ToastAndroid.LONG);
      return;
    }

    setUploading(true);
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

    const promises = files.map((file) =>
      httpClient.attachFileToMessage(firstMessage.messageID, message.answerMessageID, file)
    );
    await Promise.all(promises);

    loadData();
    setFiles([]);
    setUploading(false);
  };

  useEffect(() => {
    navigation.setOptions({ title: shortAuthor });
  }, []);

  const renderMessage = ({ item }: ListRenderItemInfo<IMessage>) => <Message message={item} />;

  return (
    <>
      <ListScreen
        startScrollFromBottom
        renderItem={renderMessage}
        data={messages.sort(compareMessages)}
        estimatedItemSize={140}
        containerStyle={{ marginBottom: '2%' }}
        ItemSeparatorComponent={() => <View style={{ marginVertical: '1%' }} />}
      />

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
