import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { useAppTheme } from '../hooks/theme';
import About from '../screens/about/About';
import AbsencesTable from '../screens/absences';
import CertificateTable from '../screens/certificate/CertificateTable';
import RequestCertificate from '../screens/certificate/RequestCertificate';
import OrderTable from '../screens/orders';
import Services from '../screens/services';
import { SettingButton } from '../screens/services/Services';
import SessionQuestionnaireList from '../screens/sessionQuestionnaire/SessionQuestionnaireList';
import Settings from '../screens/settings/Settings';
import ShortTeachPlan from '../screens/shortTeachPlan';
import TeacherTable from '../screens/teachers';
import { headerParams } from './header';

const Stack = createNativeStackNavigator();

function ServicesStackNavigator() {
  const theme = useAppTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        ...headerParams(theme),
      }}
    >
      <Stack.Screen
        name="Сервисы"
        component={Services}
        options={{ headerRight: () => <SettingButton /> }}
      />
      <Stack.Screen
        name="TeachPlan"
        component={ShortTeachPlan}
        options={{ title: 'Учебный план' }}
      />
      <Stack.Screen name="Teachers" component={TeacherTable} options={{ title: 'Преподаватели' }} />
      <Stack.Screen
        name="Absences"
        component={AbsencesTable}
        options={{ title: 'Пропущенные занятия' }}
      />
      <Stack.Screen name="Orders" component={OrderTable} options={{ title: 'Приказы' }} />
      <Stack.Screen
        name="Certificate"
        component={CertificateTable}
        options={{ title: 'Справки' }}
      />
      <Stack.Screen
        name="RequestCertificate"
        component={RequestCertificate}
        options={{ title: 'Заказ справки' }}
      />
      <Stack.Screen name="Settings" component={Settings} options={{ title: 'Настройки' }} />
      <Stack.Screen name="AboutApp" component={About} options={{ title: 'О приложении' }} />
      <Stack.Screen
        name={'SessionQuestionnaireList'}
        component={SessionQuestionnaireList}
        options={{ title: 'Анкетирование' }}
      />
    </Stack.Navigator>
  );
}

export default ServicesStackNavigator;
