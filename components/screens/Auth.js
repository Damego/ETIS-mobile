"use strict";

import React, { Component } from "react";
import { SafeAreaView, Text, StatusBar } from "react-native";
import ReCaptchaV3 from "@haskkor/react-native-recaptchav3";

import Form from "../AuthForm";
import Header from "../Header";
import Footer from "../AuthFooter";

export default class AuthPage extends Component {
  constructor(props) {
    super(props);

    // this.storage = this.props.storage;
    // this.httpClient = this.props.httpClient;
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

    this.RenderPage(this.renderTimeTablePage());
  }

  async onReceiveRecaptchaToken(token) {
    this.recaptchaToken = token;
    // await this.tryLogin();
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
        <Form onSubmit={this.onFormSubmit} />
        <Footer />
      </SafeAreaView>
    );
  }
}
