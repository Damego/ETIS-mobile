import Constants from 'expo-constants';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Alert, Linking, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import Header from '../../components/Header';
import ReCaptcha from '../../components/ReCaptcha';
import { signIn } from '../../redux/reducers/authSlice';
import { PRIVACY_POLICY_URL, httpClient, storage } from '../../utils';
import Footer from './AuthFooter';
import Form from './AuthForm';
import Recovery from './Recovery';

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
  const dispatch = useDispatch();
  const autoAuth = useSelector((state) => state.auth.shouldAutoAuth);

  // TODO: Replace with the new loading screen
  const [isLoading, setLoading] = useState(autoAuth);
  const [message, setMessage] = useState(null);
  const [recaptchaToken, setRecaptchaToken] = useState();
  const [showRecovery, setShowRecovery] = useState(false);
  const [saveCreds, setSaveCreds] = useState(true);

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
      setMessage('Политика конфиденциальности не принята');
      return;
    }

    if (useCache) {
      const accountData = await storage.getAccountData();
      // js is weird
      login = accountData.login;
      password = accountData.password;
      if (!login || !password) {
        if (autoAuth) setMessage('Данные аккаунта не найдены. Введите логин и пароль для входа');
        return;
      }
    } else if (!login || !password) {
      setMessage('Вы не ввели логин или пароль');
      return;
    }

    if (!token && !recaptchaToken) {
      // TODO: make auto attempt
      setMessage('Токен авторизации не найден. Подождите немного');
      return;
    }

    setLoading(true);

    const { errorMessage } = await httpClient.login(login, password, token || recaptchaToken);

    setRecaptchaToken(null);
    setLoading(false);

    if (errorMessage) {
      setMessage(errorMessage);
      return;
    }

    if (!useCache && saveCreds) {
      await storage.storeAccountData(login, password);
    }

    dispatch(signIn());
  };

  const onReceiveRecaptchaToken = async (token) => {
    setRecaptchaToken(token);
    await makeLogin({ token, useCache: true });
  };

  if (showRecovery) {
    return <Recovery setShowModal={setShowRecovery} />;
  }

  return (
    <>
      <View style={{ marginTop: Constants.statusBarHeight }}>
        <StatusBar style="dark" />
        {!recaptchaToken && <ReCaptcha onReceiveToken={onReceiveRecaptchaToken} />}
        <Header text="Авторизация" />

        <Form
          onSubmit={(login, password) => makeLogin({ login, password })}
          isLoading={isLoading}
          errorMessage={message}
          setShowRecovery={setShowRecovery}
          saveCreds={saveCreds}
          setSaveCreds={setSaveCreds}
        />
      </View>
      <Footer />
    </>
  );
};

export default AuthPage;
