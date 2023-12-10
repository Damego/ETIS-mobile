import React from 'react';
import { Linking, StyleSheet, TouchableOpacity, View } from 'react-native';
import AutoHeightWebView from 'react-native-autoheight-webview';
import Popover, { PopoverPlacement } from 'react-native-popover-view';

import ClickableText from '../../components/ClickableText';
import { useGlobalStyles } from '../../hooks';
import { TeacherType } from '../../models/teachers';
import { ILesson, IPair } from '../../models/timeTable';
import { fontSize } from '../../utils/texts';
import { getStyles } from '../../utils/webView';
import Text from '../../components/Text';
import { useAppTheme } from '../../hooks/theme';

export default function Pair({ pair, teachersData }: { pair: IPair; teachersData: TeacherType }) {
  const pairText = `${pair.position} пара`;

  return (
    <View style={styles.pairContainer}>
      <View style={styles.pairTimeContainer}>
        <Text style={fontSize.mini} colorVariant={'block'}>{pairText}</Text>
        <Text colorVariant={'block'}>{pair.time}</Text>
      </View>

      <View style={{ flexDirection: 'column', flex: 1 }}>
        {pair.lessons.map((lesson, ind) => (
          <Lesson data={lesson} key={lesson.subject + ind} teachersData={teachersData} />
        ))}
      </View>
    </View>
  );
}

const AnnouncePopover = ({ data }: { data: string }) => {
  const globalStyles = useGlobalStyles();
  const theme = useAppTheme();

  return (
    <Popover
      placement={PopoverPlacement.FLOATING}
      // TODO: Replace with ClickableText in future due to ref issue
      from={(_, showPopover) => (
        <TouchableOpacity onPress={showPopover}>
          <Text
            style={{ textDecorationLine: 'underline', fontWeight: '500' }}
            colorVariant={'block'}
          >
            Объявление
          </Text>
        </TouchableOpacity>
      )}
      popoverStyle={{
        borderRadius: globalStyles.border.borderRadius,
        backgroundColor: globalStyles.block.backgroundColor,
        padding: '2%',
      }}
    >
      <AutoHeightWebView
        source={{ html: data }}
        customStyle={getStyles(theme.colors.textForBlock)}
      />
    </Popover>
  );
};

const Lesson = ({ data, teachersData }: { data: ILesson; teachersData: TeacherType }) => {
  const globalStyles = useGlobalStyles();

  const location =
    data.audience && data.building && data.floor
      ? `ауд. ${data.audience} (${data.building} корпус, ${data.floor} этаж)`
      : data.audienceText;
  const audience = data.isDistance ? data.audience : location;

  let teacherName: string;

  if (data.teacher?.id) {
    teachersData.forEach(([, teachers]) => {
      const teacher = teachers.find((teacher) => teacher.id === data.teacher.id);
      if (teacher) teacherName = teacher.name;
    });
  } else teacherName = data.teacher?.name;

  return (
    <View style={styles.lessonContainer}>
      <Text style={[fontSize.medium, styles.lessonInfoText]} colorVariant={'block'}>
        {data.subject}
      </Text>

      {data.distancePlatform ? (
        <ClickableText
          text={data.distancePlatform.name}
          onPress={() => {
            Linking.openURL(data.distancePlatform.url);
          }}
          textStyle={[
            globalStyles.textColor,
            { textDecorationLine: 'underline', fontWeight: '500' },
          ]}
        />
      ) : audience ? (
        <Text colorVariant={'block'}>{audience}</Text>
      ) : (
        <AnnouncePopover data={data.announceHTML} />
      )}

      {teacherName && <Text colorVariant={'block'}>{teacherName}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  pairContainer: {
    flexDirection: 'row',
    marginBottom: '1%',
  },
  pairTimeContainer: {
    marginVertical: 2,
    marginRight: '2%',
    alignItems: 'center',
  },
  lessonContainer: {},
  lessonInfoText: {
    fontWeight: '500',
  },
});
