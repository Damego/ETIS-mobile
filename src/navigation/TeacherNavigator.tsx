import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { useAppTheme } from '~/hooks/theme';
import { headerParams } from '~/navigation/header';
import AccountSettingsButton from '~/navigation/headerButtons/AccountSettingsButton';
import { UnauthorizedTeacherStackParamList } from '~/navigation/types';
import Settings from '~/screens/unauthorizedTeacher/settings/Settings';
import Timetable from '~/screens/unauthorizedTeacher/timetable/Timetable';
import DisciplineInfo from '~/screens/etis/disciplineInfo/DisciplineInfo';

const Stack = createNativeStackNavigator<UnauthorizedTeacherStackParamList>();

const TeacherNavigator = () => {
  const theme = useAppTheme();

  return (
    <Stack.Navigator screenOptions={{...headerParams(theme)}}>
      <Stack.Screen
        name={'Timetable'}
        component={Timetable}
        options={{
          headerTitle: 'Расписание',
          headerRight: AccountSettingsButton,
        }}
      />
      <Stack.Screen
        name={'AccountSettings'}
        component={Settings}
        options={{ headerTitle: 'Аккаунт' }}
      />
      <Stack.Screen
        name={'DisciplineInfo'}
        component={DisciplineInfo}
        options={{ title: 'Информация' }}
      />
    </Stack.Navigator>
  );
};

export default TeacherNavigator;
