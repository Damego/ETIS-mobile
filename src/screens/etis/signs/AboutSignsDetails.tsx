import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import Popover, { PopoverPlacement } from 'react-native-popover-view';
import Text from '~/components/Text';
import { useGlobalStyles } from '~/hooks';
import { useAppTheme } from '~/hooks/theme';
import { fontSize } from '~/utils/texts';

const AboutSignsDetails = () => {
  const globalStyles = useGlobalStyles();
  const appTheme = useAppTheme();

  return (
    <Popover
      placement={PopoverPlacement.FLOATING}
      from={(_, showPopover) => (
        <TouchableOpacity
          onPress={showPopover}
          style={{
            justifyContent: 'center',
            // Библиотека не добавляет отступ для правого компонента в bottom tabs,
            // хотя она делает это в native stack O_o
            marginRight: '7%',
          }}
          activeOpacity={0.45}
        >
          <AntDesign name="questioncircleo" size={28} color={appTheme.colors.primary} />
        </TouchableOpacity>
      )}
      popoverStyle={{
        borderRadius: globalStyles.border.borderRadius,
        padding: '2%',
        backgroundColor: appTheme.colors.block,
      }}
    >
      <Text textBreakStrategy={'simple'} style={fontSize.medium} colorVariant={'block'}>
        Нажмите на блок контрольных точек для открытия подробной информации о каждой из них
      </Text>
    </Popover>
  );
};

export default AboutSignsDetails;
