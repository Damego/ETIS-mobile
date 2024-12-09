import { Stack } from 'expo-router/stack';
import React from 'react';
import { useAppTheme } from '~/hooks/theme';
import { headerParams } from '~/navigation/header';

const Layout = () => {
  const theme = useAppTheme();

  return (
    <Stack screenOptions={{ ...headerParams(theme) }}>
      <Stack.Screen name={'disciplineInfo'} options={{ title: 'Информация' }} />
      <Stack.Screen name={'account'} options={{ title: 'Аккаунт' }} />
      <Stack.Screen name={'bellSchedule'} options={{ title: 'График занятий' }} />
      <Stack.Screen name={'disciplineTasks'} options={{ title: 'Задания' }} />
    </Stack>
  );
};

export default Layout;
