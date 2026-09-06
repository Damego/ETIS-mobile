import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { useAppTheme } from '~/hooks/theme';
import { headerParams } from '~/navigation/header';
import GroupListSourceButton from '~/navigation/headerButtons/GroupListSourceButton';
import TeacherListSourceButton from '~/navigation/headerButtons/TeacherListSourceButton';
import { StartStackParamList } from '~/navigation/types';
import SelectFacultyScreen from '~/screens/start/SelectFaculty';
import SelectGroupScreen from '~/screens/start/SelectGroup';
import SelectStudentAccountTypeScreen from '~/screens/start/SelectStudentAccountType';
import SelectTeacherScreen from '~/screens/start/SelectTeacher';
import StartScreen from '~/screens/start/StartScreen';

const Stack = createNativeStackNavigator<StartStackParamList>();

const StartNavigator = () => {
  const { t } = useTranslation();
  const theme = useAppTheme();

  return (
    <Stack.Navigator id={'start'} screenOptions={{ ...headerParams(theme), headerTitleStyle: { fontSize: 20 } }}>
      <Stack.Screen name={'Start'} component={StartScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name={'SelectTeacher'}
        component={SelectTeacherScreen}
        options={{ title: t('navigation.teacherSearch'), headerRight: TeacherListSourceButton }}
      />
      <Stack.Screen
        name={'SelectStudentAccountType'}
        component={SelectStudentAccountTypeScreen}
        options={{ title: t('navigation.accountType') }}
      />
      <Stack.Screen
        name={'SelectFaculty'}
        component={SelectFacultyScreen}
        options={{ title: t('navigation.faculty') }}
      />
      <Stack.Screen
        name={'SelectGroup'}
        component={SelectGroupScreen}
        options={{ title: t('navigation.group'), headerRight: GroupListSourceButton }}
      />
    </Stack.Navigator>
  );
};

export default StartNavigator;
