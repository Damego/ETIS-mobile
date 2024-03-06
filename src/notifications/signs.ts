import notifee, { AndroidImportance, AndroidStyle } from '@notifee/react-native';

import { IDifferentCheckPoint } from '../tasks/signs/types';
import { getPointsWord } from '../utils/texts';
import { getRandomItem } from '../utils/utils';

export enum SignType {
  ZERO = 'ZERO',
  NEGATIVE = 'NEGATIVE',
  EXACTLY = 'EXACTLY',
  POSITIVE = 'POSITIVE',
  FULL = 'FULL',
}

const messages = {
  ZERO: ['Даже не близко!', 'Попробуй еще раз!', 'Попробуй в следующий раз нарисовать котенка!'],
  NEGATIVE: ['Всегда есть пересдача 🙃', 'Анлак'],
  EXACTLY: ['По грани', 'Идеально', 'В точку'],
  POSITIVE: ['Хорошая работа!', '👍', '👌', '🤙'],
  FULL: ['Легенда👍', '🤯', '🤩', '🥳', '🎉'],
};

const getSignType = (difference: IDifferentCheckPoint): SignType => {
  const differencePoints = difference.newResult.points - difference.newResult.passScore;

  if (differencePoints > 0) {
    return difference.newResult.points === difference.newResult.maxScore
      ? SignType.FULL
      : SignType.POSITIVE;
  }
  if (differencePoints < 0) {
    return difference.newResult.points === 0.0 ? SignType.ZERO : SignType.NEGATIVE;
  }

  return SignType.EXACTLY;
};

const buildMessage = (difference: IDifferentCheckPoint) => {
  const oldPoints = difference.oldResult.points;
  const newPoints = difference.newResult.points;

  let mark: string;
  if (oldPoints === 0.0) mark = `${newPoints}`;
  else {
    let different = newPoints - oldPoints;
    if (different % 1 !== 0) different = parseFloat(different.toFixed(1));

    mark = `${oldPoints} -> ${newPoints} (${different > 0 ? '+' : '-'}${Math.abs(different)})`;
  }

  const checkpointTheme = difference.newResult.theme;
  const signType = getSignType(difference);
  const message = getRandomItem(messages[signType]);
  const pointsString = getPointsWord(newPoints);
  return `${difference.subjectName}: ${checkpointTheme}\n${message} ${mark} ${pointsString}!`
};

export const displaySignNotification = async (difference: IDifferentCheckPoint) => {
  const signsChannelId = await notifee.createChannel({
    id: 'signs',
    name: 'Канал оценок',
    vibrationPattern: [300, 500, 300, 500],
    importance: AndroidImportance.HIGH,
    sound: 'default',
    lightColor: '#FF231F7C',

  });

  const message = buildMessage(difference);
  await notifee.displayNotification({
    title: 'Выставлена новая оценка!',
    body: message,
    android: {
      channelId: signsChannelId,
      pressAction: {
        id: 'default',
      },
      style: {
        type: AndroidStyle.BIGTEXT,
        text: message
      }
    },
  });
};
