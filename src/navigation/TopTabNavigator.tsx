import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';

import { useAppTheme } from '~/hooks/theme';
import Signs from '~/screens/etis/signs';
import RatingPage from '~/screens/etis/signs/RatingPage';
import { SignsTopTabsParamsList } from './types';

const Tab = createMaterialTopTabNavigator<SignsTopTabsParamsList>();

export default function SignsTopTabNavigator() {
  const theme = useAppTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        lazy: true,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          elevation: 0,
        },
      }}
    >
      <Tab.Screen name="Points" options={{ title: 'Баллы' }} component={Signs} />
      <Tab.Screen name="Rating" options={{ title: 'Рейтинг' }} component={RatingPage} />
    </Tab.Navigator>
  );
}
