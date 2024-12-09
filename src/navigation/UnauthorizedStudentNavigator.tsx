import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { useAppTheme } from '~/hooks/theme';
import { headerParams } from '~/navigation/header';
import AccountButton from '~/navigation/headerButtons/AccountButton';
import AppSettingsButton from '~/navigation/headerButtons/AppSettingsButton';
import { UnauthorizedStudentStackParamList } from '~/navigation/types';
import DisciplineInfo from '~/screens/etis/disciplineInfo/DisciplineInfo';
import Settings from '~/screens/unauthorizedStudent/settings/Settings';
import Timetable from '~/screens/unauthorizedStudent/timetable/Timetable';

const Stack = createNativeStackNavigator<UnauthorizedStudentStackParamList>();

const UnauthorizedStudentNavigator = () => {
  const theme = useAppTheme();

  return (
    <Stack.Navigator screenOptions={{ ...headerParams(theme) }}>
      <Stack.Screen
        name={'Timetable'}
        component={Timetable}
        options={{
          headerTitle: 'Расписание',
          headerRight: AccountButton,
        }}
      />
      <Stack.Screen
        name={'AccountSettings'}
        component={Settings}
        options={{ headerTitle: 'Аккаунт', headerRight: () => <AppSettingsButton /> }}
      />
      <Stack.Screen
        name={'DisciplineInfo'}
        component={DisciplineInfo}
        options={{ title: 'Информация' }}
      />
    </Stack.Navigator>
  );
};

export default UnauthorizedStudentNavigator;
