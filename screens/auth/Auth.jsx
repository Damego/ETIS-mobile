import React, { useState, useContext, useEffect } from 'react';
import { SafeAreaView, View, StyleSheet } from 'react-native';
import ReCaptchaV3 from '@haskkor/react-native-recaptchav3';
import Constants from 'expo-constants';

import Form from './AuthForm';
import Header from '../../components/Header';
import Footer from './AuthFooter';
import { vars } from '../../utils/vars';
import AuthContext from '../../context/AuthContext';

const styles = StyleSheet.create({});

const AuthPage = () => {
  const [isLoaded, setLoaded] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState();
  const { toggleSignIn } = useContext(AuthContext);

  const isLoginPage = async () => {
    const html = await vars.httpClient.getTimeTable();
    const data = vars.parser.isLoginPage(html);
    console.log('is login page', data);
    return data;
  };

  // useEffect(() => {
  //   if (isLoaded) return;
  //
  //   const wrapper = async () => {
  //     setLoaded(true);
  //     vars.httpClient.sessionID = await vars.storage.getSessionID();
  //
  //     if (vars.httpClient.sessionID && !(await isLoginPage())) {
  //       console.log('set sign in');
  //       toggleSignIn();
  //     }
  //   };
  //   wrapper();
  // }, [isLoaded, toggleSignIn]);

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
      toggleSignIn();
    }
  };

  const onFormSubmit = async (login, password) => {
    const sessionID = await vars.httpClient.login(login, password, recaptchaToken);
    if (!sessionID) return;

    await vars.storage.storeAccountData(login, password);
    await vars.storage.storeSessionID(sessionID);
    toggleSignIn();
  };

  const onReceiveRecaptchaToken = async (token) => {
    // await tryLogin(token);
    // setRecaptchaToken(token);
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

        <Form onSubmit={(login, password) => onFormSubmit(login, password)} />

        <Footer />
      </SafeAreaView>
    </View>
  );
};

export default AuthPage;

/*
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#C62E3E" />
        </View>
 */
