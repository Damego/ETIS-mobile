import { useNavigation } from '@react-navigation/native';
import moment from 'moment/moment';
import React, { useMemo } from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AutoHeightWebView from 'react-native-autoheight-webview';
import Popover, { PopoverPlacement } from 'react-native-popover-view';

import ClickableText from '../../components/ClickableText';
import { useGlobalStyles } from '../../hooks';
import { TeacherType } from '../../models/teachers';
import { ILesson, IPair } from '../../models/timeTable';
import { BottomTabsNavigationProp } from '../../navigation/types';
import { getTeacherName } from '../../utils/teachers';
import { fontSize } from '../../utils/texts';
import { getStyles } from '../../utils/webView';

export default function Pair({
  pair,
  teachersData,
  date,
}: {
  pair: IPair;
  teachersData: TeacherType;
  date: moment.Moment;
}) {
  const globalStyles = useGlobalStyles();
  const pairText = `${pair.position} пара`;

  return (
    <View style={styles.pairContainer}>
      <View style={styles.pairTimeContainer}>
        <Text style={[fontSize.mini, globalStyles.textColor]}>{pairText}</Text>
        <Text style={globalStyles.textColor}>{pair.time}</Text>
      </View>

      <View style={{ flexDirection: 'column', flex: 1 }}>
        {pair.lessons.map((lesson, ind) => {
          const time = moment(pair.time, 'HH:mm');

          return (
            <Lesson
              key={lesson.subject + ind}
              data={lesson}
              teachersData={teachersData}
              date={date.clone().set({ hour: time.hour(), minute: time.minutes() })}
              pairPosition={pair.position}
            />
          );
        })}
      </View>
    </View>
  );
}

const AnnouncePopover = ({ data }: { data: string }) => {
  const globalStyles = useGlobalStyles();

  return (
    <Popover
      placement={PopoverPlacement.FLOATING}
      // TODO: Replace with ClickableText in future due to ref issue
      from={(_, showPopover) => (
        <TouchableOpacity onPress={showPopover}>
          <Text
            style={[globalStyles.textColor, { textDecorationLine: 'underline', fontWeight: '500' }]}
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
        customStyle={getStyles(globalStyles.textColor.color)}
      />
    </Popover>
  );
};

const Lesson = ({
  data,
  teachersData,
  date,
  pairPosition,
}: {
  data: ILesson;
  teachersData: TeacherType;
  date: moment.Moment;
  pairPosition: number;
}) => {
  const globalStyles = useGlobalStyles();
  const navigation = useNavigation<BottomTabsNavigationProp>();

  const location =
    data.audience && data.building && data.floor
      ? `ауд. ${data.audience} (${data.building} корпус, ${data.floor} этаж)`
      : data.audienceText;
  const audience = data.isDistance ? data.audience : location;

  const teacherName = useMemo(
    () => getTeacherName(teachersData, data.teacher),
    [teachersData, data]
  );

  return (
    <TouchableOpacity
      style={styles.lessonContainer}
      onPress={() =>
        navigation.navigate('DisciplineInfo', {
          lesson: data,
          date: date.toISOString(),
          pairPosition,
        })
      }
    >
      <Text style={[fontSize.medium, styles.lessonInfoText, globalStyles.textColor]}>
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
        <Text style={globalStyles.textColor}>{audience}</Text>
      ) : (
        <AnnouncePopover data={data.announceHTML} />
      )}

      {teacherName && <Text style={globalStyles.textColor}>{teacherName}</Text>}
    </TouchableOpacity>
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
