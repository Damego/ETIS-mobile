import React from 'react';

import { ITheme } from '../styles/themes';

export const headerParams = (theme: ITheme) => {
  return {
    headerStyle: {
      backgroundColor: theme.colors.background,
    },
    headerTitleStyle: {
      color: theme.colors.primary,
      fontWeight: '600',
      fontSize: 24,
    },
    headerBackground: () => <></>,
  };
};
