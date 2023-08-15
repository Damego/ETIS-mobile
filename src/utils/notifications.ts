import * as Notifications from 'expo-notifications';
import { AndroidNotificationPriority } from 'expo-notifications/src/Notifications.types';
import { Platform } from 'react-native';

import { getPointsWord } from './texts';

export const sendNewMarkNotification = (
  subjectName: string,
  checkPointName: string,
  oldRes: number,
  newRes: number
) => {
  let mark: string;
  if (oldRes === 0.0) mark = `${newRes}`;
  else {
    let different = newRes - oldRes;
    if (different % 1 !== 0) different = parseFloat(different.toFixed(1));

    mark = `${oldRes} -> ${newRes} (${different > 0 ? '+' : '-'}${Math.abs(different)})`;
  }
  Notifications.scheduleNotificationAsync({
    content: {
      title: 'Выставлена новая оценка!',
      body: `${subjectName}: ${checkPointName}
${mark} ${getPointsWord(newRes)}!`,
    },
    trigger: {
      seconds: 5,
      channelId: 'default',
    },
  });
};
export const setNotificationHandler = () =>
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      priority: AndroidNotificationPriority.MAX,
    }),
  });
export const registerForPushNotificationsAsync = async () => {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
      sound: 'default',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync().catch();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    console.warn('Failed to get permissions for push notification!');
    return;
  }
};
