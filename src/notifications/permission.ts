import notifee, { AuthorizationStatus } from '@notifee/react-native';

import logger from '~/utils/logger';

const requestNotificationPermission = async () => {
  const settings = await notifee.requestPermission();

  if (settings.authorizationStatus === AuthorizationStatus.AUTHORIZED) {
    logger.log('[NOTIF] Notifications authorized');
  } else {
    logger.log('[NOTIF] Notification request denied');
  }
};

export default requestNotificationPermission;
