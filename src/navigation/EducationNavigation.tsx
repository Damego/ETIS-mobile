import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { useAppSelector } from '~/hooks';
import { useAppTheme } from '~/hooks/theme';
import { headerParams } from '~/navigation/header';
import AccountSettingsButton from '~/navigation/headerButtons/AccountSettingsButton';
import { EducationStackParamList } from '~/navigation/types';
import Absences from '~/screens/etis/absences';
import AccountSettings from '~/screens/etis/accountSettings/AccountSettings';
import Auth from '~/screens/etis/auth/Auth';
import BellSchedule from '~/screens/etis/bellSchedule/BellSchedule';
import CathedraTimetable from '~/screens/etis/cathedraTimetable/CathedraTimetable';
import Certificate from '~/screens/etis/certificate/Certificate';
import CertificateIncome from '~/screens/etis/certificate/CertificateIncome';
import RequestCertificate from '~/screens/etis/certificate/RequestCertificate';
import ChangeEmail from '~/screens/etis/changeCredentials/ChangeEmail';
import ChangePassword from '~/screens/etis/changeCredentials/ChangePassword';
import DisciplineInfo from '~/screens/etis/disciplineInfo/DisciplineInfo';
import DisciplinesTasks from '~/screens/etis/disciplinesTasks/DisciplinesTasks';
import ETISScreen from '~/screens/etis/main/MainScreen';
import MessageHistory from '~/screens/etis/messageHistory/MessageHistory';
import Rating from '~/screens/etis/rating';
import SessionQuestionnaire from '~/screens/etis/sessionQuestionnaire/SessionQuestionnaire';
import SessionQuestionnaireList from '~/screens/etis/sessionQuestionnaire/SessionQuestionnaireList';
import ShortTeachPlan from '~/screens/etis/shortTeachPlan';
import Teachers from '~/screens/etis/teachers';
import Timetable from '~/screens/etis/timeTable/TimeTable';
import Orders from '~/screens/orders';

const Stack = createStackNavigator<EducationStackParamList>();

const EducationNavigation = () => {
  const { isSignedIn } = useAppSelector((state) => state.auth);
  const theme = useAppTheme();

  return (
    <Stack.Navigator screenOptions={{ headerShown: true, ...headerParams(theme) }}>
      {!isSignedIn ? (
        <Stack.Screen name={'Auth'} component={Auth} options={{ title: 'Вход' }} />
      ) : (
        <>
          <Stack.Screen
            name={'Main'}
            component={ETISScreen}
            options={{ title: 'Обучение', headerRight: () => <AccountSettingsButton /> }}
          />
          <Stack.Screen
            name={'AccountSettings'}
            component={AccountSettings}
            options={{ title: 'Аккаунт' }}
          />
          <Stack.Screen
            name={'Timetable'}
            component={Timetable}
            options={{ title: 'Расписание' }}
          />
          <Stack.Screen
            name={'DisciplineInfo'}
            component={DisciplineInfo}
            options={{ title: 'Информация' }}
          />
          <Stack.Screen
            name={'TeachPlan'}
            component={ShortTeachPlan}
            options={{ title: 'Учебный план' }}
          />
          <Stack.Screen
            name={'Teachers'}
            component={Teachers}
            options={{ title: 'Преподаватели' }}
          />
          <Stack.Screen
            name={'Absences'}
            component={Absences}
            options={{ title: 'Пропущенные занятия' }}
          />
          <Stack.Screen name={'Orders'} component={Orders} options={{ title: 'Приказы' }} />
          <Stack.Screen
            name={'Certificate'}
            component={Certificate}
            options={{ title: 'Справки' }}
          />
          <Stack.Screen
            name={'RequestCertificate'}
            component={RequestCertificate}
            options={{ title: 'Заказ справки' }}
          />
          <Stack.Screen
            name={'SessionQuestionnaireList'}
            component={SessionQuestionnaireList}
            options={{ title: 'Анкетирование' }}
          />
          <Stack.Screen
            name={'BellSchedule'}
            component={BellSchedule}
            options={{ title: 'Расписание звонков' }}
          />
          <Stack.Screen name={'MessageHistory'} component={MessageHistory} />
          <Stack.Screen
            name={'CertificateIncome'}
            component={CertificateIncome}
            options={{ title: 'Справка о доходах' }}
          />
          <Stack.Screen
            name={'SessionQuestionnaire'}
            component={SessionQuestionnaire}
            options={{ title: 'Анкетирование' }}
          />
          <Stack.Screen
            name={'DisciplineTasks'}
            component={DisciplinesTasks}
            options={{ title: 'Задания' }}
          />
          <Stack.Screen
            name={'ChangePassword'}
            component={ChangePassword}
            options={{ title: 'Смена пароля' }}
          />
          <Stack.Screen
            name={'ChangeEmail'}
            component={ChangeEmail}
            options={{ title: 'Смена почты' }}
          />
          <Stack.Screen
            name={'CathedraTimetable'}
            component={CathedraTimetable}
            options={{ title: 'Расписание' }}
          />
          <Stack.Screen name={'Rating'} component={Rating} options={{ title: 'Рейтинг' }} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default EducationNavigation;
