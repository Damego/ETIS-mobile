import notifee, { AndroidStyle } from '@notifee/react-native';

import i18next from '~/i18n';

export const startDownloadNotification = async (fileName: string) => {
  const channelId = await notifee.createChannel({
    id: 'download',
    name: i18next.t('notifications.downloadChannel'),
  });
  const id = await notifee.displayNotification({
    title: i18next.t('notifications.downloading'),
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
    title: i18next.t('notifications.downloaded'),
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
  const message = i18next.t('notifications.downloadFailedFile', { fileName });

  await notifee.displayNotification({
    id,
    title: i18next.t('notifications.downloadError'),
    body: message,
    android: {
      channelId,
      progress: {
        indeterminate: false,
      },
      style: {
        type: AndroidStyle.BIGTEXT,
        text: message,
      },
    },
  });
};
