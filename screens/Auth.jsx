"use strict";

import React, { useState } from "react";
import { SafeAreaView } from "react-native";
import ReCaptchaV3 from "@haskkor/react-native-recaptchav3";

import Form from "../components/AuthForm";
import {Header} from "../components/Header";
import Footer from "../components/AuthFooter";
import { vars } from "../utils/vars";

export default AuthPage = (props) => {
  const [recaptchaToken, setRecaptchaToken] = useState("");
  
  const tryLogin = async () => {
    let accountData = await vars.storage.getAccountData();
    if (!accountData.login || !accountData.password) {
      return;
    }

    let sessionID = await vars.httpClient.login(
      accountData.login,
      accountData.password,
      recaptchaToken
    );

    vars.httpClient.sessionID = sessionID;
    props.onSignIn();
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
  };

  const onReceiveRecaptchaToken = async (token) => {
    setRecaptchaToken = token;
    await tryLogin();
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
      <Form
        onSubmit={(login, password) => onFormSubmit(login, password)}
      />
      <Footer />
    </SafeAreaView>
  );
};
