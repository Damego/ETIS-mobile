import notifee, { EventType } from '@notifee/react-native';
import { useEffect, useRef } from 'react';

import { INotificationData } from '../notifications/types';

const useNotification = (callback: (data: INotificationData) => void) => {
  // Колбэк хранится в ref, чтобы листенер всегда звал свежую версию:
  // эффект с [] подписывается один раз, а замыкание с первой версией
  // колбэка устарело бы при первом же ре-рендере с новыми зависимостями
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    notifee.getInitialNotification().then((notification) => {
      if (!notification) return;

      callbackRef.current(notification.notification.data as unknown as INotificationData);
    });

    return notifee.onForegroundEvent(async (event) => {
      if (event.type !== EventType.PRESS) return;
      if (event.detail.notification) {
        callbackRef.current(event.detail.notification.data as unknown as INotificationData);
      }
    });
  }, []);
};

export default useNotification;
