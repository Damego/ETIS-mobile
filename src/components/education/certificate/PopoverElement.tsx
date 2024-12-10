import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Popover, { PopoverPlacement } from 'react-native-popover-view';
import Text from '~/components/Text';
import { useAppTheme } from '~/hooks/theme';
import { fontSize } from '~/utils/texts';

export const PopoverElement = ({ text }) => {
  const appTheme = useAppTheme();
  return (
    <Popover
      placement={PopoverPlacement.FLOATING}
      from={(_, showPopover) => (
        <TouchableOpacity onPress={showPopover}>
          <AntDesign name="infocirlceo" size={24} color={appTheme.colors.text} />
        </TouchableOpacity>
      )}
      popoverStyle={[styles.popover, { backgroundColor: appTheme.colors.container }]}
    >
      <Text style={fontSize.medium}>{text}</Text>
    </Popover>
  );
};

const styles = StyleSheet.create({
  popover: {
    borderRadius: 10,
    padding: '2%',
  },
});
