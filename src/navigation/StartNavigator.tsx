import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { useAppTheme } from '~/hooks/theme';
import { headerParams } from '~/navigation/header';
import { StartStackParamList } from '~/navigation/types';
import SelectFacultyScreen from '~/screens/start/SelectFaculty';
import SelectGroupScreen from '~/screens/start/SelectGroup';
import SelectStudentAccountTypeScreen from '~/screens/start/SelectStudentAccountType';
import SelectTeacherScreen from '~/screens/start/SelectTeacher';
import StartScreen from '~/screens/start/StartScreen';

const Stack = createNativeStackNavigator<StartStackParamList>();

const StartNavigator = () => {
  const theme = useAppTheme();

  return (
    <Stack.Navigator screenOptions={{ ...headerParams(theme), headerTitleStyle: { fontSize: 20 } }}>
      <Stack.Screen name={'Start'} component={StartScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name={'SelectTeacher'}
        component={SelectTeacherScreen}
        options={{ title: 'Поиск преподавателя' }}
      />
      <Stack.Screen
        name={'SelectStudentAccountType'}
        component={SelectStudentAccountTypeScreen}
        options={{ title: 'Тип аккаунта' }}
      />
      <Stack.Screen name={'SelectFaculty'} component={SelectFacultyScreen} options={{ title: 'Факультет' }} />
      <Stack.Screen name={'SelectGroup'} component={SelectGroupScreen} options={{ title: 'Группа' }} />
    </Stack.Navigator>
  );
};

export default StartNavigator;
