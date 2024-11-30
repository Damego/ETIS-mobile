import { Stack } from 'expo-router/stack';
import React from 'react';
import { useAppTheme } from '~/hooks/theme';
import { headerParams } from '~/navigation/header';
import GroupListSourceButton from '~/navigation/headerButtons/GroupListSourceButton';
import TeacherListSourceButton from '~/navigation/headerButtons/TeacherListSourceButton';

const StartLayout = () => {
  const theme = useAppTheme();

  return (
    <Stack
      initialRouteName={'index'}
      screenOptions={{ ...headerParams(theme), headerTitleStyle: { fontSize: 20 } }}
    >
      <Stack.Screen name={'index'} options={{ headerShown: false }} />
      <Stack.Screen name={'faculty'} options={{ title: 'Факультет' }} />
      <Stack.Screen
        name={'group'}
        options={{ title: 'Группа', headerRight: GroupListSourceButton }}
      />
      <Stack.Screen name={'student'} options={{ title: 'Тип аккаунта' }} />
      <Stack.Screen
        name={'teacher'}
        options={{ title: 'Поиск преподавателя', headerRight: TeacherListSourceButton }}
      />
    </Stack>
  );
};

export default StartLayout;
