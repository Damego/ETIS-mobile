import { Stack } from 'expo-router/stack';
import React from 'react';
import { useAppTheme } from '~/hooks/theme';
import { headerParams } from '~/navigation/header';
import AccountSettingsButton from '~/navigation/headerButtons/AccountSettingsButton';

const TeacherLayout = () => {
  const theme = useAppTheme();

  return (
    <Stack screenOptions={{ ...headerParams(theme) }}>
      <Stack.Screen
        name={'timetable'}
        options={{
          headerTitle: 'Расписание',
          headerRight: AccountSettingsButton,
        }}
      />
      {/*<Stack.Screen*/}
      {/*  name={'AccountSettings'}*/}
      {/*  options={{ headerTitle: 'Аккаунт', headerRight: () => <AppSettingsButton /> }}*/}
      {/*/>*/}
      {/*<Stack.Screen name={'DisciplineInfo'} options={{ title: 'Информация' }} />*/}
    </Stack>
  );
};

export default TeacherLayout;
