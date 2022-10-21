import React, {useState, Component} from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity } from 'react-native';

import Header from './components/Header';
import Form from './components/Form';
import HTTPClient from './http/client';

class App extends Component {
  state = {
    recaptchaToken: '',
  }

  defaultAuth = (login, password, token) => {
    HTTPClient.login(login, password, token);
  };

  render() {
    return (
    <SafeAreaView>
      <Header/>
      <Form defaultAuth={this.defaultAuth} />
    </SafeAreaView>
  );
  }
}

export default App;