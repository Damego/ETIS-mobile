import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';

import { INotificationData } from '../utils/notifications';

const useNotification = (callback: (data: INotificationData) => void) => {
  const lastNotificationResponse = Notifications.useLastNotificationResponse();

  useEffect(() => {
    if (!lastNotificationResponse) return;

    const data = lastNotificationResponse.notification.request.content.data as INotificationData;
    callback(data);
  }, [lastNotificationResponse]);
};

export default useNotification;
