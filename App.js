"use strict";
import React, { Component } from "react";
import { StyleSheet, SafeAreaView, Text, StatusBar } from "react-native";
import ReCaptchaV3 from "@haskkor/react-native-recaptchav3";

import Header from "./components/Header";
import Form from "./components/Form";
import HTTPClient from "./utils/http";
import Storage from "./utils/storage";
import DataParsing from './utils/parser';

class App extends Component {
  constructor() {
    super();
    this.state = {
      currentPage: this.renderAuthPage(),
    };

    this.recaptchaToken = null;
    this.httpClient = new HTTPClient();
    this.storage = new Storage();
    this.parser = new DataParsing();
  }

  defaultAuth = async (login, password) => {
    let sessionID = await this.httpClient.login(
      login,
      password,
      this.recaptchaToken
    );
    if (!sessionID) return;

    await this.storage.storeAccountData(login, password);
    await this.storage.storeSessionID(sessionID);

    let html = await this.httpClient.getTimeTable();
    let text = this.parser.parseHeader(html);
    console.log(text);
  };

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

  reRenderPage(page) {
    this.setState((state, props) => {
      return { currentPage: page };
    });
  }

  onReceiveToken = async (token) => {
    this.recaptchaToken = token;

    await this.tryLogin();
  };

  renderAuthPage() {
    return (
      <SafeAreaView>
        <ReCaptchaV3
          action={"submit"}
          captchaDomain={"https://student.psu.ru"}
          siteKey={"6LfeYf8UAAAAAIF22Cn9YFwXlZk1exjVNyF2Jmo6"}
          onReceiveToken={this.onReceiveToken}
        />

        <Header text={"Авторизация"} />
        <Form defaultAuth={this.defaultAuth} />
      </SafeAreaView>
    );
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
    return this.state.currentPage;
  }
}

export default App;
