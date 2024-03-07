import notifee, { EventType } from '@notifee/react-native';
import { useEffect } from 'react';

import { INotificationData } from '../notifications/types';

const useNotification = (callback: (data: INotificationData) => void) => {
  useEffect(() => {
    notifee.getInitialNotification().then((notification) => {
      if (!notification) return;

      callback(notification.notification.data as unknown as INotificationData);
    });

    return notifee.onForegroundEvent(async (event) => {
      if (event.type !== EventType.PRESS) return;
      callback(event.detail.notification.data as unknown as INotificationData);
    });
  }, []);
};

export default useNotification;
