"use strict";
import React, { Component } from "react";
import { StyleSheet, SafeAreaView, Text, StatusBar } from "react-native";
import ReCaptchaV3 from "@haskkor/react-native-recaptchav3";

import Header from "./components/Header";
import Form from "./components/Form";
import HTTPClient from "./utils/http";
import Storage from "./utils/storage";
// import DataParsing from "./utils/parser";

class App extends Component {
  constructor() {
    super();
    this.state = {
      currentPage: this.renderAuthPage(),
    };

    this.recaptchaToken = null;
    this.httpClient = new HTTPClient();
    this.storage = new Storage();
    // this.dataParsing = new DataParsing();
  }

  defaultAuth = async (login, password, token) => {
    await this.httpClient.login(login, password, token);
    await this.httpClient.getTimeTable();
  // defaultAuth = async (login, password) => {
  //   let sessionID = await this.httpClient.login(
  //     login,
  //     password,
  //     this.recaptchaToken
  //   );
  //   if (!sessionID) return;

  //   await this.storage.storeAccountData(login, password);
  //   await this.storage.storeSessionID(sessionID);
  // };

  // async tryLogin() {
  //   let accountData = await this.storage.getAccountData();
  //   if (!accountData.login || !accountData.password) {
  //     return;
  //   }

  //   let sessionID = await this.httpClient.login(
  //     accountData.login,
  //     accountData.password,
  //     this.recaptchaToken
  //   );
  //   this.httpClient.sessionID = sessionID;

  //   this.reRenderPage(this.renderTimeTablePage());
  // }

  // reRenderPage(page) {
  //   this.setState((state, props) => {
  //     return { currentPage: page };
  //   });
  // }

  // onReceiveToken = async (token) => {
  //   this.recaptchaToken = token;

  //   await this.tryLogin();
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

  // async getTimeTable() {
  //   let html = await this.httpClient.getTimeTable();
  //   let text = this.dataParsing.parseTimeTable(html);
  //   return text;
  // }

  // async getAnnounce() {
  //   let html = await this.httpClient.getAnnounce();
  //   let text = this.dataParsing.parseAnnounce(html);
  //   return text;
  // }

  // async getTeachers() {
  //   let html = await this.httpClient.getTeachers();
  //   let text = this.dataParsing.parseTeachers(html);
  //   return text;
  // }

  // async getTeacherNotes() {
  //   let html = await this.httpClient.getTeacherNotes();
  //   let text = this.dataParsing.parseTeacherNotes(html);
  //   return text;
  // }

  renderTimeTablePage() {
    console.log("timetable");
    // this.getAnnounce();
    return (
      <SafeAreaView>
        <Text>{`Вы авторизованы!\n${this.httpClient.sessionID}`}</Text>
        <StatusBar></StatusBar>
      </SafeAreaView>
    );
  }

  render() {
    return this.state.currentPage;
  }
}

export default App;
