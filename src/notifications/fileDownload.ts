import notifee, { AndroidStyle } from '@notifee/react-native';

export const startDownloadNotification = async (fileName: string) => {
  const channelId = await notifee.createChannel({
    id: 'download',
    name: 'Канал загрузок',
  });
  const id = await notifee.displayNotification({
    title: 'Скачивается файл',
    body: fileName,
    android: {
      channelId,
      progress: {
        indeterminate: true,
      },
      autoCancel: false,
      ongoing: true,
    },
  });

  return { id, channelId };
};

export const finishDownloadNotification = async ({
  id,
  channelId,
  fileName,
  fileUri,
}: {
  id: string;
  channelId: string;
  fileName: string;
  fileUri: string;
}) => {
  await notifee.displayNotification({
    id,
    title: 'Файл скачан',
    body: fileName,
    data: {
      type: 'file',
      file: {
        uri: fileUri,
      },
    },
    android: {
      channelId,
      progress: {
        indeterminate: false,
      },
    },
  });
};

export const errorDownloadNotification = async ({
  id,
  channelId,
  fileName,
}: {
  id: string;
  channelId: string;
  fileName: string;
}) => {
  const message = `Не удалось скачать файл ${fileName}`;

  await notifee.displayNotification({
    id,
    title: 'Ошибка скачивания',
    body: message,
    android: {
      channelId,
      progress: {
        indeterminate: false,
      },
      style: {
        type: AndroidStyle.BIGTEXT,
        text: message,
      }
    },
  });
};
