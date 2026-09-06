import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { useAppSelector } from '~/hooks';
import { useAppTheme } from '~/hooks/theme';
import { headerParams } from '~/navigation/header';
import AccountSettingsButton from '~/navigation/headerButtons/AccountSettingsButton';
import AppSettingsButton from '~/navigation/headerButtons/AppSettingsButton';
import { EducationStackParamList } from '~/navigation/types';
import Absences from '~/screens/etis/absences';
import AccountSettings from '~/screens/etis/accountSettings/AccountSettings';
import AudienceTimetable from '~/screens/etis/audienceTimetable/AudienceTimetable';
import SelectAudience from '~/screens/etis/audienceTimetable/SelectAudience';
import Auth from '~/screens/etis/auth/Auth';
import BellSchedule from '~/screens/etis/bellSchedule/BellSchedule';
import CathedraTimetable from '~/screens/etis/cathedraTimetable/CathedraTimetable';
import CertificateIncome from '~/screens/etis/certificate/CertificateIncome';
import CertificateTable from '~/screens/etis/certificate/CertificateTable';
import RequestCertificate from '~/screens/etis/certificate/RequestCertificate';
import ChangeEmail from '~/screens/etis/changeCredentials/ChangeEmail';
import ChangePassword from '~/screens/etis/changeCredentials/ChangePassword';
import DigitalResources from '~/screens/etis/digitalResources/DigitalResources';
import DisciplineEducationalComplex from '~/screens/etis/disciplineEducationalComplex/DisciplineEducationalComplex';
import DisciplineEducationalComplexTheme from '~/screens/etis/disciplineEducationalComplexTheme/DisciplineEducationalComplexTheme';
import DisciplineInfo from '~/screens/etis/disciplineInfo/DisciplineInfo';
import DisciplinesTasks from '~/screens/etis/disciplinesTasks/DisciplinesTasks';
import ETISScreen from '~/screens/etis/main/MainScreen';
import MessageHistory from '~/screens/etis/messageHistory/MessageHistory';
import Rating from '~/screens/etis/rating';
import SessionQuestionnaire from '~/screens/etis/sessionQuestionnaire/SessionQuestionnaire';
import SessionQuestionnaireList from '~/screens/etis/sessionQuestionnaire/SessionQuestionnaireList';
import ShortTeachPlan from '~/screens/etis/shortTeachPlan';
import Teachers from '~/screens/etis/teachers';

import Orders from '../screens/etis/orders';

const Stack = createStackNavigator<EducationStackParamList>();

const EducationNavigation = () => {
  const { t } = useTranslation();
  const { isSignedIn } = useAppSelector((state) => state.account);
  const theme = useAppTheme();

  return (
    <Stack.Navigator id='education' screenOptions={{ headerShown: true, ...headerParams(theme) }}>
      {!isSignedIn
        ? (
          <Stack.Screen name={'Auth'} component={Auth} options={{ title: t('navigation.auth') }} />
        )
        : (
          <>
            <Stack.Screen
              name={'Main'}
              component={ETISScreen}
              options={{ title: t('navigation.education'), headerRight: () => <AccountSettingsButton /> }}
            />
            <Stack.Screen
              name={'AccountSettings'}
              component={AccountSettings}
              options={{ title: t('navigation.account'), headerRight: () => <AppSettingsButton /> }}
            />
            <Stack.Screen
              name={'DisciplineInfo'}
              component={DisciplineInfo}
              options={{ title: t('navigation.info') }}
            />
            <Stack.Screen
              name={'TeachPlan'}
              component={ShortTeachPlan}
              options={{ title: t('navigation.teachPlan') }}
            />
            <Stack.Screen
              name={'Teachers'}
              component={Teachers}
              options={{ title: t('navigation.teachers') }}
            />
            <Stack.Screen
              name={'Absences'}
              component={Absences}
              options={{ title: t('navigation.absences') }}
            />
            <Stack.Screen name={'Orders'} component={Orders} options={{ title: t('navigation.orders') }} />
            <Stack.Screen
              name={'Certificate'}
              component={CertificateTable}
              options={{ title: t('navigation.certificates') }}
            />
            <Stack.Screen
              name={'RequestCertificate'}
              component={RequestCertificate}
              options={{ title: t('navigation.orderCertificate') }}
            />
            <Stack.Screen
              name={'SessionQuestionnaireList'}
              component={SessionQuestionnaireList}
              options={{ title: t('navigation.questionnaire') }}
            />
            <Stack.Screen
              name={'BellSchedule'}
              component={BellSchedule}
              options={{ title: t('navigation.bellSchedule') }}
            />
            <Stack.Screen name={'MessageHistory'} component={MessageHistory} />
            <Stack.Screen
              name={'CertificateIncome'}
              component={CertificateIncome}
              options={{ title: t('navigation.certificateIncome') }}
            />
            <Stack.Screen
              name={'SessionQuestionnaire'}
              component={SessionQuestionnaire}
              options={{ title: t('navigation.questionnaire') }}
            />
            <Stack.Screen
              name={'DisciplineTasks'}
              component={DisciplinesTasks}
              options={{ title: t('navigation.tasks') }}
            />
            <Stack.Screen
              name={'ChangePassword'}
              component={ChangePassword}
              options={{ title: t('navigation.changePassword') }}
            />
            <Stack.Screen
              name={'ChangeEmail'}
              component={ChangeEmail}
              options={{ title: t('navigation.changeEmail') }}
            />
            <Stack.Screen
              name={'CathedraTimetable'}
              component={CathedraTimetable}
              options={{ title: t('navigation.timetable') }}
            />
            <Stack.Screen name={'Rating'} component={Rating} options={{ title: t('navigation.rating') }} />
            <Stack.Screen
              name={'DisciplineEducationalComplex'}
              component={DisciplineEducationalComplex}
              options={{ title: t('navigation.dec') }}
            />
            <Stack.Screen
              name={'DisciplineEducationalComplexTheme'}
              component={DisciplineEducationalComplexTheme}
              options={{ title: t('navigation.dec') }}
            />
            <Stack.Screen
              name={'SelectAudience'}
              component={SelectAudience}
              options={{ title: t('navigation.audience') }}
            />
            <Stack.Screen
              name={'AudienceTimetable'}
              component={AudienceTimetable}
              options={{ title: t('navigation.timetable') }}
            />
            <Stack.Screen
              name={'DigitalResources'}
              component={DigitalResources}
              options={{ title: t('navigation.resources') }}
            />
          </>
        )}
    </Stack.Navigator>
  );
};

export default EducationNavigation;
