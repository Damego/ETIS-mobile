import { Stack } from 'expo-router/stack';
import React from 'react';
import { useAppTheme } from '~/hooks/theme';
import { headerParams } from '~/navigation/header';
import AccountButton from '~/navigation/headerButtons/AccountButton';

const GroupLayout = () => {
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
    </Stack>
  );
};

export default GroupLayout;
