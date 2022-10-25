"use strict"
import React, {Component} from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';

import Header from './components/Header';
import Form from './components/Form';
import HTTPClient from './utils/http';
import DataParsing from './utils/parser';

class App extends Component {
  constructor() {
    super();

    this.httpClient = new HTTPClient();
    this.parser = new DataParsing();
  }

  defaultAuth = async (login, password, token) => {
    await this.httpClient.login(login, password, token);
    let html = await this.httpClient.getTimeTable();
    let text = this.parser.getDataTimeTable(html);
  };

  render() {
    // 
    return (
    <SafeAreaView>
      <Header/>
      <Form defaultAuth={this.defaultAuth} />
    </SafeAreaView>
  );
  }
}

export default App;