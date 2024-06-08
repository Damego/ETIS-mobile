import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { useAppSelector } from '~/hooks';
import { useAppTheme } from '~/hooks/theme';
import SignsTopTabNavigator from '~/navigation/TopTabNavigator';
import { headerParams } from '~/navigation/header';
import { ETISStackParamList } from '~/navigation/types';
import Announce from '~/screens/etis/announce/Announce';
import Auth from '~/screens/etis/auth/Auth';
import ETISScreen from '~/screens/etis/main/MainScreen';
import Messages from '~/screens/etis/messages/Messages';

const Stack = createNativeStackNavigator<ETISStackParamList>();

const EtisNavigation = () => {
  const { isSignedIn } = useAppSelector((state) => state.auth);
  const theme = useAppTheme();

  return (
    <Stack.Navigator screenOptions={{ headerShown: true, ...headerParams(theme) }}>
      {!isSignedIn ? (
        <Stack.Screen name={'Auth'} component={Auth} options={{ title: 'Вход' }} />
      ) : (
        <>
          <Stack.Screen name={'Main'} component={ETISScreen} options={{ headerShown: false }} />
          <Stack.Screen
            name={'SignsNavigator'}
            component={SignsTopTabNavigator}
            options={{ title: 'Успеваемость' }}
          />
          <Stack.Screen name={'Messages'} component={Messages} options={{ title: 'Сообщения' }} />
          <Stack.Screen name={'Announces'} component={Announce} options={{ title: 'Объявления' }} />
          <Stack.Screen name={'MoreScreens'} component={Auth} options={{ title: 'Сервисы ЕТИС' }} />
          <Stack.Screen
            name={'PersonalRecords'}
            component={Auth}
            options={{ title: 'Личные записи' }}
          />
          <Stack.Screen name={'DisciplineInfo'} component={Auth} />
          <Stack.Screen name={'TeachPlan'} component={Auth} options={{ title: 'Учебный план' }} />
          <Stack.Screen name={'Teachers'} component={Auth} options={{ title: 'Преподаватели' }} />
          <Stack.Screen
            name={'Absences'}
            component={Auth}
            options={{ title: 'Пропущенные занятия' }}
          />
          <Stack.Screen name={'Orders'} component={Auth} options={{ title: 'Приказы' }} />
          <Stack.Screen name={'Certificate'} component={Auth} options={{ title: 'Справки' }} />
          <Stack.Screen
            name={'RequestCertificate'}
            component={Auth}
            options={{ title: 'Заказ справки' }}
          />
          <Stack.Screen
            name={'SessionQuestionnaireList'}
            component={Auth}
            options={{ title: 'Анкетирование' }}
          />
          <Stack.Screen
            name={'BellSchedule'}
            component={Auth}
            options={{ title: 'Расписание звонков' }}
          />
          <Stack.Screen name={'History'} component={Auth} />
          <Stack.Screen name={'SignsDetails'} component={Auth} options={{ title: 'Подробности' }} />
          <Stack.Screen
            name={'CertificateIncome'}
            component={Auth}
            options={{ title: 'Справка о доходах' }}
          />
          <Stack.Screen
            name={'SessionQuestionnaire'}
            component={Auth}
            options={{ title: 'Анкетирование' }}
          />
          <Stack.Screen name={'DisciplineTasks'} component={Auth} options={{ title: 'Задания' }} />
          <Stack.Screen
            name={'ChangePassword'}
            component={Auth}
            options={{ title: 'Смена пароля' }}
          />
          <Stack.Screen name={'ChangeEmail'} component={Auth} options={{ title: 'Смена почты' }} />
          <Stack.Screen
            name={'CathedraTimetable'}
            component={Auth}
            options={{ title: 'Расписание' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default EtisNavigation;
