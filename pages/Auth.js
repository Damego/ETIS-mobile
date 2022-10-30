import React, { Component } from "react";
import { SafeAreaView, Text, StatusBar } from "react-native";
import ReCaptchaV3 from "@haskkor/react-native-recaptchav3";

import Form from "../components/AuthForm";
import Header from "../components/Header";
import Footer from "../components/AuthFooter";

export default class AuthPage extends Component {
  constructor(props) {
    super(props);

    this.storage = this.props.storage;
    this.httpClient = this.props.httpClient;
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

    this.reRenderPage(this.renderTimeTablePage());
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

  reRenderPage(page) {
    this.setState((state, props) => {
      return { currentPage: page };
    });
  }

  renderTimeTablePage() {
    console.log("timetable");
    return (
      <SafeAreaView>
        <Text>{`Вы авторизованы! ${this.httpClient.sessionID}`}</Text>
        <StatusBar></StatusBar>
      </SafeAreaView>
    );
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
