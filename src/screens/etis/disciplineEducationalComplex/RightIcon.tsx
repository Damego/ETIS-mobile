import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import { useAppTheme } from '~/hooks/theme';
import { RIGHT_ICON_SIZE } from '~/screens/etis/disciplineEducationalComplex/components/common';

const RightIcon = () => {
  const theme = useAppTheme();

  return <AntDesign name={'right'} size={RIGHT_ICON_SIZE} color={theme.colors.text} />;
};

export default React.memo(RightIcon);
