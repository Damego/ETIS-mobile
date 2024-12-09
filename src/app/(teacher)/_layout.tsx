import { Stack } from 'expo-router/stack';
import React from 'react';
import { useAppTheme } from '~/hooks/theme';
import { headerParams } from '~/navigation/header';
import AccountButton from '~/navigation/headerButtons/AccountButton';

const TeacherLayout = () => {
  const theme = useAppTheme();

  return (
    <Stack screenOptions={{ ...headerParams(theme) }}>
      <Stack.Screen
        name={'timetable'}
        options={{
          headerTitle: 'Расписание',
          headerRight: AccountButton,
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
