import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { useAppTheme } from '~/hooks/theme';
import { headerParams } from '~/navigation/header';
import AccountSettingsButton from '~/navigation/headerButtons/AccountSettingsButton';
import { UnauthorizedTeacherStackParamList } from '~/navigation/types';
import Settings from '~/screens/unauthorizedTeacher/settings/Settings';
import Timetable from '~/screens/unauthorizedTeacher/timetable/Timetable';

const Stack = createNativeStackNavigator<UnauthorizedTeacherStackParamList>();

const TeacherNavigator = () => {
  const theme = useAppTheme();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name={'Timetable'}
        component={Timetable}
        options={{
          ...headerParams(theme),
          headerTitle: 'Расписание',
          headerRight: AccountSettingsButton,
        }}
      />
      <Stack.Screen
        name={'AccountSettings'}
        component={Settings}
        options={{ ...headerParams(theme), headerTitle: 'Аккаунт' }}
      />
    </Stack.Navigator>
  );
};

export default TeacherNavigator;
