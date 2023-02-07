"use strict";

import React, { useState } from "react";
import { SafeAreaView } from "react-native";
import ReCaptchaV3 from "@haskkor/react-native-recaptchav3";

import Form from "../components/AuthForm";
import Header from "../components/Header";
import Footer from "../components/AuthFooter";
import { vars } from "../utils/vars";

const AuthPage = (props) => {
  const [recaptchaToken, setRecaptchaToken] = useState();
  console.log("AUTH?", props);

  const tryLogin = async (token = null) => {
    let accountData = await vars.storage.getAccountData();
    if (!accountData.login || !accountData.password) {
      return;
    }

    let sessionID = await vars.httpClient.login(
      accountData.login,
      accountData.password,
      (token == null) ? recaptchaToken : token
    );
    if (sessionID) {
      console.log("AUTO AUTHENTICATED");
      props.onSignIn();
    }
  };

  const onFormSubmit = async (login, password) => {
    let sessionID = await vars.httpClient.login(
      login,
      password,
      recaptchaToken
    );
    if (!sessionID) return;

    await vars.storage.storeAccountData(login, password);
    await vars.storage.storeSessionID(sessionID);
    props.onSignIn();
  };

  const onReceiveRecaptchaToken = async (token) => {
    console.log("RECEIVED TOKEN", token);
    await tryLogin(token);
    setRecaptchaToken(token);
  };

  return (
    <SafeAreaView>
      <ReCaptchaV3
        action={"submit"}
        captchaDomain={"https://student.psu.ru"}
        siteKey={"6LfeYf8UAAAAAIF22Cn9YFwXlZk1exjVNyF2Jmo6"}
        onReceiveToken={(token) => onReceiveRecaptchaToken(token)}
      />

      <Header text={"Авторизация"} />
      <Form onSubmit={(login, password) => onFormSubmit(login, password)} />
      <Footer />
    </SafeAreaView>
  );
};

export default AuthPage;
