import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import { Text } from 'react-native';
import { TouchableOpacity } from 'react-native';
import Popover, { PopoverPlacement } from 'react-native-popover-view';

import { useGlobalStyles } from '../../hooks';
import { useAppTheme } from '../../hooks/theme';
import { fontSize } from '../../utils/texts';

export const AboutSignsDetails = () => {
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
          <AntDesign name="questioncircleo" size={28} color={'#C62E3E'} />
        </TouchableOpacity>
      )}
      popoverStyle={{
        borderRadius: globalStyles.border.borderRadius,
        padding: '2%',
        backgroundColor: appTheme.colors.background,
      }}
    >
      <Text textBreakStrategy={'simple'} style={[fontSize.medium, globalStyles.textColor]}>
        {/* TODO: Добавить гифку, перефразировать текст */}
        Нажмите на блок с контрольными точками и вы перейдёте на экран с подробным описанием всех
        контрольных точек
      </Text>
    </Popover>
  );
};

export default AboutSignsDetails;
