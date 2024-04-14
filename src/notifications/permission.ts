import notifee, { AuthorizationStatus } from '@notifee/react-native';

const requestNotificationPermission = async () => {
  const settings = await notifee.requestPermission();

  if (settings.authorizationStatus === AuthorizationStatus.AUTHORIZED) {
    console.log('[NOTIF] Notifications authorized');
  } else {
    console.log('[NOTIF] Notification request denied');
  }
};

export default requestNotificationPermission;
