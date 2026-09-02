import { AntDesign } from '@expo/vector-icons';
import React from 'react';

import { useAppTheme } from '~/hooks/theme';
import { iconSize } from '~/utils/texts';

const RightIcon = () => {
  const theme = useAppTheme();

  return <AntDesign name={'right'} size={iconSize.medium} color={theme.colors.text} />;
};

export default React.memo(RightIcon);
