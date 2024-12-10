import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import { RIGHT_ICON_SIZE } from '~/components/education/disciplineEducationalComplex/common';
import { useAppTheme } from '~/hooks/theme';

const RightIcon = () => {
  const theme = useAppTheme();

  return <AntDesign name={'right'} size={RIGHT_ICON_SIZE} color={theme.colors.text} />;
};

export default React.memo(RightIcon);
