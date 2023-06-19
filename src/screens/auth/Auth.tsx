import React, { useEffect, useState } from 'react';

import Screen from '../../components/Screen';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { setAuthorizing, setUserCredentials } from '../../redux/reducers/authSlice';
import Footer from './AuthFooter';
import Form from './AuthForm';
import Recovery from './Recovery';

const AuthScreen = () => {
  const dispatch = useAppDispatch();

  const { userCredentials } = useAppSelector((state) => state.auth);

  const [message, setMessage] = useState(null);
  const [showRecovery, setShowRecovery] = useState(false);

  useEffect(() => {
    if (userCredentials) dispatch(setAuthorizing(true));
  }, [userCredentials]);

  const onFormSubmit = (login: string, password: string) => {
    if (!login || !password) {
      setMessage('Вы не ввели логин или пароль');
      return;
    }

    dispatch(setUserCredentials({ userCredentials: {login, password}, fromStorage: false }));
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
