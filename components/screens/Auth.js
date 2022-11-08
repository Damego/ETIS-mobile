"use strict";

import React, { Component } from "react";
import { SafeAreaView } from "react-native";
import ReCaptchaV3 from "@haskkor/react-native-recaptchav3";

import Form from "../AuthForm";
import Header from "../Header";
import Footer from "../AuthFooter";

export default class AuthPage extends Component {
  constructor(props) {
    super(props);

    this.httpClient = this.props.route.params.httpClient;
    this.storage = this.props.route.params.storage;
    console.log(this.props);
  }

  async tryLogin() {
    let accountData = await this.storage.getAccountData();
    if (!accountData.login || !accountData.password) {
      return;
    }

    let sessionID = await this.httpClient.login(
      accountData.login,
      accountData.password,
      this.recaptchaToken
    );

    this.httpClient.sessionID = sessionID;
    this.httpClient.changeSingInState(); // I know this code is shit but I don't fucking care rn
  }

  async onFormSubmit(login, password) {
    let sessionID = await this.httpClient.login(
      login,
      password,
      this.recaptchaToken
    );
    if (!sessionID) return;

    await this.storage.storeAccountData(login, password);
    await this.storage.storeSessionID(sessionID);
  }

  async onReceiveRecaptchaToken(token) {
    this.recaptchaToken = token;
    await this.tryLogin();
  }

  render() {
    return (
      <SafeAreaView>
        <ReCaptchaV3
          action={"submit"}
          captchaDomain={"https://student.psu.ru"}
          siteKey={"6LfeYf8UAAAAAIF22Cn9YFwXlZk1exjVNyF2Jmo6"}
          onReceiveToken={(token) => this.onReceiveRecaptchaToken(token)}
        />

        <Header text={"ЕТИС | Авторизация"} />
        <Form
          onSubmit={(login, password) => this.onFormSubmit(login, password)}
        />
        <Footer />
      </SafeAreaView>
    );
  }
}
