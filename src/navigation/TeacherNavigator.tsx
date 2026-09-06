import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { useAppTheme } from '~/hooks/theme';
import { headerParams } from '~/navigation/header';
import AccountSettingsButton from '~/navigation/headerButtons/AccountSettingsButton';
import AppSettingsButton from '~/navigation/headerButtons/AppSettingsButton';
import { UnauthorizedTeacherStackParamList } from '~/navigation/types';
import DisciplineInfo from '~/screens/etis/disciplineInfo/DisciplineInfo';
import Settings from '~/screens/unauthorizedTeacher/settings/Settings';
import Timetable from '~/screens/unauthorizedTeacher/timetable/Timetable';

const Stack = createNativeStackNavigator<UnauthorizedTeacherStackParamList>();

const TeacherNavigator = () => {
  const { t } = useTranslation();
  const theme = useAppTheme();

  return (
    <Stack.Navigator id={'unauthorized-teacher'} screenOptions={{ ...headerParams(theme) }}>
      <Stack.Screen
        name={'Timetable'}
        component={Timetable}
        options={{
          headerTitle: t('navigation.timetable'),
          headerRight: AccountSettingsButton,
        }}
      />
      <Stack.Screen
        name={'AccountSettings'}
        component={Settings}
        options={{ headerTitle: t('navigation.account'), headerRight: () => <AppSettingsButton /> }}
      />
      <Stack.Screen
        name={'DisciplineInfo'}
        component={DisciplineInfo}
        options={{ title: t('navigation.info') }}
      />
    </Stack.Navigator>
  );
};

export default TeacherNavigator;
