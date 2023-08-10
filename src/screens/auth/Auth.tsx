import React, { useEffect, useState } from 'react';
import { ToastAndroid } from 'react-native';

import { cache } from '../../cache/smartCache';
import Screen from '../../components/Screen';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { setAuthorizing, setUserCredentials } from '../../redux/reducers/authSlice';
import { httpClient } from '../../utils';
import showPrivacyPolicy from '../../utils/privacyPolicy';
import Footer from './AuthFooter';
import Form from './AuthForm';
import Recovery from './Recovery';

const AuthScreen = () => {
  const dispatch = useAppDispatch();

  const { userCredentials, isSignedOut } = useAppSelector((state) => state.auth);

  const [message, setMessage] = useState(null);
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
      setMessage('Вы не ввели логин или пароль');
      return;
    }

    if (!(await httpClient.isInternetReachable())) {
      ToastAndroid.show('Нет интернет соединения!', ToastAndroid.SHORT);
      return;
    }

    dispatch(setUserCredentials({ userCredentials: { login, password }, fromStorage: false }));
    dispatch(setAuthorizing(true));
  };

  if (showRecovery) {
    return <Recovery setShowModal={setShowRecovery} />;
  }

  return (
    <Screen>
      <Form onSubmit={onFormSubmit} errorMessage={message} setShowRecovery={setShowRecovery} />
      <Footer />
    </Screen>
  );
};

export default AuthScreen;
