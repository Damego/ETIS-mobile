"use strict";
import React, { Component } from "react";
import { StyleSheet, SafeAreaView, Text, StatusBar } from "react-native";
import ReCaptchaV3 from "@haskkor/react-native-recaptchav3";

import Header from './components/Header';
import Form from './components/Form';
import HTTPClient from './utils/http';

class App extends Component {
  constructor() {
    super();
    this.state = {
      currentPage: this.renderAuthPage(),
    };

    this.recaptchaToken = null;
    this.httpClient = new HTTPClient();
  }

  defaultAuth = async (login, password, token) => {
    await this.httpClient.login(login, password, token);
    await this.httpClient.getTimeTable();
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
