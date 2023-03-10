import React, { useState } from 'react';
import { SafeAreaView } from 'react-native';
import ReCaptchaV3 from '@haskkor/react-native-recaptchav3';

import Form from './AuthForm';
import Header from '../../components/Header';
import Footer from './AuthFooter';
import { vars } from '../../utils/vars';

const AuthPage = ({ onSignIn }) => {
  const [recaptchaToken, setRecaptchaToken] = useState();

  const tryLogin = async (token = null) => {
    const accountData = await vars.storage.getAccountData();
    if (!accountData.login || !accountData.password) {
      return;
    }

    const sessionID = await vars.httpClient.login(
      accountData.login,
      accountData.password,
      token == null ? recaptchaToken : token
    );
    if (sessionID) {
      console.log('AUTO AUTHENTICATED');
      onSignIn();
    }
  };

  const onFormSubmit = async (login, password) => {
    const sessionID = await vars.httpClient.login(login, password, recaptchaToken);
    if (!sessionID) return;

    await vars.storage.storeAccountData(login, password);
    await vars.storage.storeSessionID(sessionID);
    onSignIn();
  };

  const onReceiveRecaptchaToken = async (token) => {
    console.log('RECEIVED TOKEN', token);
    await tryLogin(token);
    setRecaptchaToken(token);
  };

  return (
    <SafeAreaView>
      <ReCaptchaV3
        action="submit"
        captchaDomain="https://student.psu.ru"
        siteKey="6LfeYf8UAAAAAIF22Cn9YFwXlZk1exjVNyF2Jmo6"
        onReceiveToken={(token) => onReceiveRecaptchaToken(token)}
      />

      <Header text="Авторизация" />
      <Form onSubmit={(login, password) => onFormSubmit(login, password)} />
      <Footer />
    </SafeAreaView>
  );
};

export default AuthPage;
