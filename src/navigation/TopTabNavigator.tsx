import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import { useAppTheme } from '../hooks/theme';
import Signs from '../screens/signs';
import RatingPage from '../screens/signs/RatingPage';

const Tab = createMaterialTopTabNavigator();

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
