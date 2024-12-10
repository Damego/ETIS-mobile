import { Redirect } from 'expo-router';
import { Stack } from 'expo-router/stack';
import React from 'react';
import { useAppSelector } from '~/hooks';

const EducationLayout = () => {
  const { isSignedIn } = useAppSelector((state) => state.account);

  if (!isSignedIn) {
    return <Redirect href={'/auth'} />;
  }

  return (
    <Stack initialRouteName="main">
      <Stack.Screen name={'main'} options={{ title: 'Обучение' }} />
      <Stack.Screen name={'absences'} options={{ title: 'Пропуски' }} />
      <Stack.Screen name={'audienceTimetable'} options={{ title: 'Расписание' }} />
      <Stack.Screen name={'selectAudience'} options={{ title: 'Аудитории' }} />
      <Stack.Screen name={'cathedraTimetable'} options={{ title: 'Расписание' }} />
      <Stack.Screen name={'certificates'} options={{ title: 'Справки' }} />
      <Stack.Screen name={'changeEmail'} options={{ title: 'Почта' }} />
      <Stack.Screen name={'changePassword'} options={{ title: 'Пароль' }} />
      <Stack.Screen name={'digitalResources'} options={{ title: 'Ресурсы' }} />
      <Stack.Screen name={'disciplineEducationalComplex'} options={{ title: 'УМК' }} />
      <Stack.Screen name={'disciplineEducationalComplexTheme'} options={{ title: 'УМК' }} />
      <Stack.Screen name={'messageHistory'} options={{ title: 'Сообщения' }} />
      <Stack.Screen name={'orders'} options={{ title: 'Приказы' }} />
      <Stack.Screen name={'rating'} options={{ title: 'Рейтинг' }} />
      <Stack.Screen name={'requestCertificate'} options={{ title: 'Справки' }} />
      <Stack.Screen name={'sessionQuestionnaire'} options={{ title: 'Анкетирование' }} />
      <Stack.Screen name={'sessionQuestionnaireList'} options={{ title: 'Анкетирование' }} />
      <Stack.Screen name={'teachers'} options={{ title: 'Преподаватели' }} />
      <Stack.Screen name={'teachplan'} options={{ title: 'Учебный план' }} />
      <Stack.Screen name={'certificateIncome'} options={{ title: 'Заказ справки' }} />
    </Stack>
  );
};

export default EducationLayout;
