import { AntDesign, Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import * as Clipboard from 'expo-clipboard';
import { Image } from 'expo-image';
import React from 'react';
import { Linking, StyleSheet, ToastAndroid, View } from 'react-native';
import ClickableText from '~/components/ClickableText';
import Text from '~/components/Text';
import { useClient } from '~/data/client';
import { useAppSelector } from '~/hooks';
import { useAppTheme } from '~/hooks/theme';
import useQuery from '~/hooks/useQuery';
import { RequestType } from '~/models/results';
import { DistancePlatformTypes, ILesson, ITeacher } from '~/models/timeTable';
import { getTeacherName } from '~/utils/teachers';
import { fontSize, formatAudience } from '~/utils/texts';

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
    [DistancePlatformTypes.zoom, require('../../../../../assets/platforms/zoom.svg'), false],
    [
      DistancePlatformTypes.bbb,
      require('../../../../../assets/platforms/bigbluebutton.svg'),
      false,
    ],
    [DistancePlatformTypes.skype, require('../../../../../assets/platforms/skype.svg'), false],
    [
      DistancePlatformTypes.yandexTelemost,
      require('../../../../../assets/platforms/telemost.svg'),
      true,
    ],
  ];

  const platform = platformTypeToAsset.find(([$type]) => type === $type);
  if (platform) return [platform[1], platform[2]];
};

const IconInfo = ({ icon, text }: { icon: keyof typeof Ionicons.glyphMap; text: string }) => {
  const theme = useAppTheme();

  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={28} style={styles.icon} color={theme.colors.text} />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

export const TimeInfo = ({ date, pairPosition }: { date: dayjs.Dayjs; pairPosition: number }) => {
  const isLyceum = useAppSelector((state) => state.student.info?.isLyceum);
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
    skipInitialGet: !teacher?.id,
  });

  const teacherName = getTeacherName(data, teacher);
  return <IconInfo icon={'school-outline'} text={teacherName} />;
};

export const AudienceInfo = ({ lesson }: { lesson: ILesson }) => {
  const theme = useAppTheme();

  if (lesson.distancePlatform) {
    const assetDetails = getAssetByPlatformType(lesson.distancePlatform.type);
    return (
      <View style={styles.container}>
        {assetDetails ? (
          <Image
            source={assetDetails[0]}
            style={{ height: 30, width: 30 }}
            tintColor={!assetDetails[1] && theme.colors.text}
          />
        ) : (
          <AntDesign name={'questioncircleo'} size={28} color={theme.colors.text} />
        )}
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
        />
      </View>
    );
  }

  const audience = formatAudience(lesson);
  if (!audience) return null;
  return <IconInfo icon={'business-outline'} text={audience} />;
};

export const GroupsInfo = ({ groups }: { groups: string[] }) => {
  return <IconInfo icon={'school-outline'} text={groups.join('\n')} />;
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
    ...fontSize.big,
  },
});
