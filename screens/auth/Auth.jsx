import Constants from 'expo-constants';
import { StatusBar } from 'expo-status-bar';
import React, { useContext, useState } from 'react';
import { View } from 'react-native';

import Header from '../../components/Header';
import ReCaptcha from '../../components/ReCaptcha';
import AuthContext from '../../context/AuthContext';
import { httpClient, storage } from '../../utils';
import Footer from './AuthFooter';
import Form from './AuthForm';

const AuthPage = () => {
  const [isLoading, setLoading] = useState(false);
  const [loginErrorMessage, changeLoginMessageError] = useState(null);
  const [recaptchaToken, setRecaptchaToken] = useState();
  const { toggleSignIn } = useContext(AuthContext);

  const makeLogin = async ({ token, useCache, login, password }) => {
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

    // TODO: reload recaptcha component
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
    <View style={{ marginTop: Constants.statusBarHeight }}>
      <StatusBar style={'dark'} />
      <ReCaptcha onReceiveToken={onReceiveRecaptchaToken}/>

      <Header text="Авторизация" />

      <Form
        onSubmit={(login, password) => makeLogin({ login, password })}
        isLoading={isLoading}
        errorMessage={loginErrorMessage}
      />

      <Footer />
    </View>
  );
};

export default AuthPage;
