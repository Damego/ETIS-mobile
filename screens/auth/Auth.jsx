import Constants from 'expo-constants';
import { StatusBar } from 'expo-status-bar';
import React, { useContext, useEffect, useState } from 'react';
import { Alert, Linking, View } from 'react-native';

import Header from '../../components/Header';
import ReCaptcha from '../../components/ReCaptcha';
import AuthContext from '../../context/AuthContext';
import { PRIVACY_POLICY_URL, httpClient, storage } from '../../utils';
import Footer from './AuthFooter';
import Form from './AuthForm';

const showPrivacyPolicy = () => {
  Alert.alert(
    'Политика приватности',
    'Перед использованием приложения примите политику конфиденциальности',
    [
      {
        text: 'Открыть',
        onPress: () => {
          showPrivacyPolicy();
          Linking.openURL(PRIVACY_POLICY_URL);
        },
      },
      { text: 'Принять', onPress: () => storage.acceptPrivacyPolicy() },
    ]
  );
};

const AuthPage = () => {
  const { toggleSignIn, showLoading } = useContext(AuthContext);
  const [isLoading, setLoading] = useState(showLoading);
  const [loginErrorMessage, changeLoginMessageError] = useState(null);
  const [recaptchaToken, setRecaptchaToken] = useState();

  useEffect(() => {
    const wrapper = async () => {
      if (!(await storage.hasAcceptedPrivacyPolicy())) {
        showPrivacyPolicy();
      }
    };
    wrapper();
  }, []);

  const makeLogin = async ({ token, useCache, login, password }) => {
    if (!(await storage.hasAcceptedPrivacyPolicy())) {
      changeLoginMessageError('Политика конфиденциальности не принята');
      return;
    }

    if (useCache) {
      const accountData = await storage.getAccountData();
      // js is weird
      login = accountData.login;
      password = accountData.password;
      if (!login || !password) return;
    } else if (!login || !password) {
      changeLoginMessageError('Вы не ввели логин или пароль');
      return;
    }

    if (!token && !recaptchaToken) {
      changeLoginMessageError('Токен авторизации не найден. Перезайдите в приложение');
      return;
    }

    setLoading(true);

    const { sessionID, errorMessage } = await httpClient.login(
      login,
      password,
      token || recaptchaToken
    );

    setLoading(false);

    if (errorMessage) {
      changeLoginMessageError(errorMessage);
      return;
    }

    await storage.storeSessionID(sessionID);
    if (!useCache) {
      await storage.storeAccountData(login, password);
    }

    toggleSignIn();
  };

  const onReceiveRecaptchaToken = async (token) => {
    setRecaptchaToken(token);
    await makeLogin({ token, useCache: true });
  };

  return (
    <>
      <View style={{ marginTop: Constants.statusBarHeight }}>
        <StatusBar style={'dark'} />
        <ReCaptcha onReceiveToken={onReceiveRecaptchaToken} />

        <Header text="Авторизация" />

        <Form
          onSubmit={(login, password) => makeLogin({ login, password })}
          isLoading={isLoading}
          errorMessage={loginErrorMessage}
        />
      </View>
      <Footer />
    </>
  );
};

export default AuthPage;
