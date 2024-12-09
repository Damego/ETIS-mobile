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
    <Stack initialRouteName="main" screenOptions={{ headerShown: false }}>
      <Stack.Screen name={'main'} />
      <Stack.Screen name={'absences'} />
      <Stack.Screen name={'audienceTimetable'} />
      <Stack.Screen name={'cathedraTimetable'} />
      <Stack.Screen name={'certificates'} />
      <Stack.Screen name={'changeEmail'} />
      <Stack.Screen name={'changePassword'} />
      <Stack.Screen name={'digitalResources'} />
      <Stack.Screen name={'disciplineEducationalComplex'} />
      <Stack.Screen name={'disciplineEducationalComplexTheme'} />
      <Stack.Screen name={'messageHistory'} />
      <Stack.Screen name={'orders'} />
      <Stack.Screen name={'rating'} />
      <Stack.Screen name={'requestCertificate'} />
      <Stack.Screen name={'sessionQuestionnaire'} />
      <Stack.Screen name={'sessionQuestionnaireList'} />
      <Stack.Screen name={'teachers'} />
      <Stack.Screen name={'teachplan'} />
    </Stack>
  );
};

export default EducationLayout;
