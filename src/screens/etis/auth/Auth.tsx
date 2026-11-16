import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { cache } from '~/cache/smartCache';
import Screen from '~/components/Screen';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { setAuthorizing, setUserCredentials } from '~/redux/reducers/accountSlice';
import { httpClient, showToast } from '~/utils';
import showPrivacyPolicy from '~/utils/privacyPolicy';

import Footer from './AuthFooter';
import Form from './AuthForm';
import Recovery from './Recovery';

const AuthScreen = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const { userCredentials, isSignedOut } = useAppSelector((state) => state.account);

  const [message, setMessage] = useState<string | null>(null);
  const [showRecovery, setShowRecovery] = useState(false);

  useEffect(() => {
    // Вышли из аккаунта, но с сохранением данных,
    // но делать повторную авторизацию в данном случае не нужно
    if (isSignedOut) return;

    if (userCredentials) dispatch(setAuthorizing(true));
  }, [userCredentials]);

  const onFormSubmit = async (login: string, password: string) => {
    if (!(await cache.hasAcceptedPrivacyPolicy())) {
      showPrivacyPolicy();
      return;
    }

    if (!login || !password) {
      setMessage(t('auth.noLoginOrPassword'));
      return;
    }

    if (!(await httpClient.isInternetReachable())) {
      showToast(t('auth.noInternet'));
      return;
    }

    dispatch(setUserCredentials({ userCredentials: { login, password }, fromStorage: false }));
    dispatch(setAuthorizing(true));
  };

  if (showRecovery) {
    return <Recovery setShowModal={setShowRecovery} />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
      <Screen>
        <View style={{ flex: 1 }}>
          <Form errorMessage={message} setShowRecovery={setShowRecovery} onSubmit={onFormSubmit} />
        </View>
        <Footer />
      </Screen>
    </SafeAreaView>
  );
};

export default AuthScreen;
