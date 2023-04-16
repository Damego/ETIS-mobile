import ReCaptchaV3 from '@haskkor/react-native-recaptchav3';
import Constants from 'expo-constants';
import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView, View, Alert, Text } from 'react-native';
import axios from "axios";

import {ErrorBoundary} from 'react-error-boundary';

import Header from '../../components/Header';
import AuthContext from '../../context/AuthContext';
import { vars } from '../../utils/vars';
import Footer from './AuthFooter';
import Form from './AuthForm';

const AuthPage = () => {
  const [isLoading, setLoading] = useState(false);
  const [loginErrorMessage, changeLoginMessageError] = useState(null);
  const [recaptchaToken, setRecaptchaToken] = useState();
  const { toggleSignIn } = useContext(AuthContext);

  const isLoginPage = async () => {
    const html = await vars.httpClient.getTimeTable();
    return vars.parser.isLoginPage(html);
  };

  useEffect(() => {
    if (!isLoading) return;

    const wrapper = async () => {
      setLoading(true);
      vars.httpClient.sessionID = await vars.storage.getSessionID();

      if (vars.httpClient.sessionID && !(await isLoginPage())) {
        setLoading(false);
        toggleSignIn();
      }
    };
    wrapper();
  }, [isLoading, toggleSignIn]);

  const tryLogin = async (token = null) => {
    const accountData = await vars.storage.getAccountData();
    if (!accountData.login || !accountData.password) {
      return;
    }
    setLoading(true);

    const sessionID = await vars.httpClient.login(
      accountData.login,
      accountData.password,
      token == null ? recaptchaToken : token
    );
    if (sessionID && !(await isLoginPage())) {
      console.log('AUTO AUTHENTICATED');
      toggleSignIn();
    }
    setLoading(false);
  };

  const onFormSubmit = async (login, password) => {
    if (login.length === 0 || password.length === 0) {
      changeLoginMessageError('Вы не ввели логин или пароль');
      return;
    }

    // setLoading(true);
    Alert.alert("first");
    const { sessionID, errorMessage } = await vars.httpClient.login(
      login,
      password,
      recaptchaToken
    );
    Alert.alert("second");
    if (sessionID) {
      await vars.storage.storeAccountData(login, password);
      Alert.alert("third");
      await vars.storage.storeSessionID(sessionID);
      Alert.alert("4th");
      toggleSignIn();
    } else {
      changeLoginMessageError(errorMessage);
    }

    // setLoading(false);
  };

  const onReceiveRecaptchaToken = async (token) => {
    await tryLogin(token);
    setRecaptchaToken(token);
  };

  return (
    <View style={{ marginTop: Constants.statusBarHeight }}>
      <SafeAreaView>
        <ReCaptchaV3
          action="submit"
          captchaDomain="https://student.psu.ru"
          siteKey="6LfeYf8UAAAAAIF22Cn9YFwXlZk1exjVNyF2Jmo6"
          onReceiveToken={(token) => onReceiveRecaptchaToken(token)}
        />

        <Header text="Авторизация" />

        <Form
          onSubmit={(login, password) => onFormSubmit(login, password)}
          isLoading={isLoading}
          errorMessage={loginErrorMessage}
        />

        <Footer />
      </SafeAreaView>
    </View>
  );
};

export default AuthPage;
