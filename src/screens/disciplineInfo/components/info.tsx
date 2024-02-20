import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import * as Clipboard from 'expo-clipboard';
import { Image } from 'expo-image';
import React from 'react';
import { Linking, StyleSheet, ToastAndroid, View } from 'react-native';

import ClickableText from '../../../components/ClickableText';
import Text from '../../../components/Text';
import { useClient } from '../../../data/client';
import { useAppSelector } from '../../../hooks';
import { useAppTheme } from '../../../hooks/theme';
import useQuery from '../../../hooks/useQuery';
import { RequestType } from '../../../models/results';
import { DistancePlatformTypes, ILesson, ITeacher } from '../../../models/timeTable';
import { getTeacherName } from '../../../utils/teachers';
import { fontSize, formatAudience } from '../../../utils/texts';

const PAIR_LENGTH = 95;
const LESSON_LENGTH = 40;

const studentTimeInfo = {
  length: PAIR_LENGTH,
  name: 'пара',
  ending: 'я',
} as const;

const lyceumTimeInfo = {
  length: LESSON_LENGTH,
  name: 'урок',
  ending: 'й',
} as const;

const getAssetByPlatformType = (type: DistancePlatformTypes) => {
  const platformTypeToAsset = [
    [DistancePlatformTypes.zoom, require('../../../../assets/platforms/zoom.svg')],
    [DistancePlatformTypes.bbb, require('../../../../assets/platforms/bigbluebutton.svg')],
    [DistancePlatformTypes.skype, require('../../../../assets/platforms/skype.svg')],
  ];

  return platformTypeToAsset.find(([$type]) => type === $type)[1];
};

const IconInfo = ({ icon, text }: { icon: keyof typeof Ionicons.glyphMap; text: string }) => {
  const theme = useAppTheme();

  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={30} style={styles.icon} color={theme.colors.textForBlock} />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

export const TimeInfo = ({ date, pairPosition }: { date: dayjs.Dayjs; pairPosition: number }) => {
  const { isLyceum } = useAppSelector((state) => state.student.info);
  const { name, length, ending } = isLyceum ? lyceumTimeInfo : studentTimeInfo;

  date = date.locale('ru');
  const day = date.format('D MMMM');
  const startTime = date.format('HH:mm');
  const endTime = date.clone().add(length, 'minute').format('HH:mm');

  const text = `${day}\n${startTime} – ${endTime} · ${pairPosition}-${ending} ${name}`;
  return <IconInfo icon={'time-outline'} text={text} />;
};

export const TeacherInfo = ({ teacher }: { teacher?: ITeacher }) => {
  const client = useClient();
  const { data } = useQuery({
    method: client.getTeacherData,
    payload: {
      requestType: RequestType.tryCache,
    },
  });

  if (!teacher || !data) return;

  const teacherName = getTeacherName(data, teacher);
  return <IconInfo icon={'school-outline'} text={teacherName} />;
};

export const AudienceInfo = ({ lesson }: { lesson: ILesson }) => {
  const theme = useAppTheme();

  if (lesson.distancePlatform) {
    const asset = getAssetByPlatformType(lesson.distancePlatform.type);
    return (
      <View style={styles.container}>
        <Image
          source={asset}
          style={{ height: 30, width: 30 }}
          tintColor={theme.colors.textForBlock}
        />
        <ClickableText
          text={lesson.distancePlatform.name}
          onPress={() => {
            Linking.openURL(lesson.distancePlatform.url);
          }}
          onLongPress={() => {
            Clipboard.setStringAsync(lesson.distancePlatform.url).then(() => {
              ToastAndroid.show('Скопировано в буфер обмена', ToastAndroid.LONG);
            });
          }}
          textStyle={styles.text}
          colorVariant={'block'}
        />
      </View>
    );
  }

  const audience = formatAudience(lesson);
  return <IconInfo icon={'business-outline'} text={audience} />;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
  },
  icon: {
    alignSelf: 'center',
  },
  text: {
    flexShrink: 1,
    ...fontSize.large,
  },
});
