import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import { Linking, TouchableOpacity, View } from 'react-native';
import Popover, { PopoverPlacement } from 'react-native-popover-view';
import ClickableText from '~/components/ClickableText';
import { useGlobalStyles } from '~/hooks';
import { useAppTheme } from '~/hooks/theme';

const GROUP_LIST_SOURCE_URL = 'https://student.psu.ru/pls/stu_cus_et/stu.all_timetable';

const GroupListSourceButton = () => {
  const theme = useAppTheme();
  const globalStyles = useGlobalStyles();

  return (
    <Popover
      placement={PopoverPlacement.FLOATING}
      from={(_, showPopover) => (
        <TouchableOpacity
          onPress={showPopover}
          style={{
            justifyContent: 'center',
            marginHorizontal: 14,
          }}
        >
          <AntDesign name="questioncircleo" size={28} color={theme.colors.text} />
        </TouchableOpacity>
      )}
      popoverStyle={{
        borderRadius: globalStyles.border.borderRadius,
        padding: '2%',
        backgroundColor: theme.colors.container,
      }}
    >
      <View>
        <ClickableText onPress={() => Linking.openURL(GROUP_LIST_SOURCE_URL)}>
          Весь список групп взят из расписания групп в ЕТИС ({GROUP_LIST_SOURCE_URL})
        </ClickableText>
      </View>
    </Popover>
  );
};

export default GroupListSourceButton;
