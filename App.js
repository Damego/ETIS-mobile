"use strict";
import React, { Component } from "react";
import { StyleSheet, SafeAreaView } from "react-native";
import ReCaptchaV3 from "@haskkor/react-native-recaptchav3";

import Header from "./components/Header";
import Form from "./components/Form";
import HTTPClient from "./utils/http";
import Storage from "./utils/storage";

class App extends Component {
  constructor() {
    super();

    this.recaptchaToken = null;
    this.httpClient = new HTTPClient();
    this.storage = new Storage();

    this.storage.getSessionID().then((sessionID) => {
      if (!!sessionID) {
        console.log(this.httpClient.sessionID);
        return (this.httpClient.sessionID = sessionID);
      }

      // TODO: Здесь токен пуст
      // this.storage.getAccountData().then(
      //   (accountData) => {
      //     if (!accountData.login || !accountData.password) {
      //       return;
      //     }
      //     this.httpClient.login(accountData.login, accountData.password, this.recaptchaToken).then(
      //       (sessionID) => {
      //         this.httpClient.sessionID = sessionID;
      //     }
      //   )
      //   }
      // )
    });
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

    console.log(await this.storage.getAccountData());
    console.log(await this.storage.getSessionID());
  };

  render() {
    console.log(this.httpClient.sessionID);
    if (!this.httpClient.sessionID) {
      return (
        <SafeAreaView>
          <ReCaptchaV3
            action={"submit"}
            captchaDomain={"https://student.psu.ru"}
            siteKey={"6LfeYf8UAAAAAIF22Cn9YFwXlZk1exjVNyF2Jmo6"}
            onReceiveToken={(token) => {
              this.recaptchaToken = token;
            }}
          />

          <Header text={"Авторизация"} />
          <Form defaultAuth={this.defaultAuth} />
        </SafeAreaView>
      );
    }

    // TODO: Вывод страницы с расписанием
    return (
      <SafeAreaView>
        <Text>{`Вы авторизованы! ${this.httpClient.sessionID}`}</Text>
      </SafeAreaView>
    );
  }
}

export default App;
