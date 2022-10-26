"use strict";
import React, { Component } from "react";
import { StyleSheet, SafeAreaView } from "react-native";

import Header from "./components/Header";
import Form from "./components/Form";
import HTTPClient from "./utils/http";

class App extends Component {
  constructor() {
    super();

    this.httpClient = new HTTPClient();
  }

  defaultAuth = async (login, password, token) => {
    await this.httpClient.login(login, password, token);
    await this.httpClient.getTimeTable();
  };

  render() {
    //
    return (
      <SafeAreaView>
        <Header text={"Авторизация"} />
        <Form defaultAuth={this.defaultAuth} />
      </SafeAreaView>
    );
  }
}

export default App;
