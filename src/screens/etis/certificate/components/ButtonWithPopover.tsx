import React from 'react';
import {
  StyleProp, TextStyle, TouchableOpacity, ViewStyle
} from 'react-native';
import Popover, { PopoverPlacement } from 'react-native-popover-view';

import Card from '~/components/Card';
import Text from '~/components/Text';
import { useGlobalStyles } from '~/hooks';
import { useAppTheme } from '~/hooks/theme';
import { fontSize } from '~/utils/texts';

export const ButtonWithPopover = ({
  title,
  info,
  textStyle,
  cardStyle,
  icon,
}: {
  readonly title: string;
  readonly info: string;
  readonly textStyle?: StyleProp<TextStyle>;
  readonly cardStyle?: StyleProp<ViewStyle>;
  readonly icon?: React.ReactNode;
}) => {
  const globalStyles = useGlobalStyles();
  const appTheme = useAppTheme();

  return (
    <Card style={cardStyle}>
      <Popover
        placement={PopoverPlacement.FLOATING}
        from={(_, showPopover) => (
          <TouchableOpacity
            style={[
              {
                paddingVertical: '2%',
                flexDirection: 'row',
                alignItems: 'center',
              },
            ]}
            activeOpacity={0.45}
            onPress={showPopover}
          >
            {icon}
            <Text style={textStyle}>{title}</Text>
          </TouchableOpacity>
        )}
        popoverStyle={{
          borderRadius: globalStyles.border.borderRadius,
          padding: '2%',
          backgroundColor: appTheme.colors.container,
        }}
      >
        <Text selectable textBreakStrategy={'simple'} style={fontSize.medium}>
          {info}
        </Text>
      </Popover>
    </Card>
  );
};
