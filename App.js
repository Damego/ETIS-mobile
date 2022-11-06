"use strict";
import React, { Component } from "react";
import { Text, SafeAreaView } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AuthPage from "./components/screens/Auth";
import TabNavigator from "./components/TabNavigation";

import HTTPClient from "./utils/http";
import Storage from "./utils/storage";

const Stack = createNativeStackNavigator();

class App extends Component {
  constructor() {
    super();
    this.state = {
      isSignedIn: false,
      isLoaded: false,
    };

    // Они мне нужны во всех экранах, как мне их использовать?
    this.httpClient = new HTTPClient();
    this.storage = new Storage();

    this.studentData = null;
  }

  render() {
    if (!this.state.isLoaded) {
      return (
        <SafeAreaView>
          <Text>{"Loading..."}</Text>
        </SafeAreaView>
      );
    }
    return (
      <NavigationContainer>
        <Stack.Navigator>
          {!this.state.isSignedIn ? (
            <Stack.Screen
              name="Authorization"
              component={AuthPage}
              options={{ headerShown: false }}
            />
          ) : (
            <Stack.Screen
              name="Navigator"
              component={TabNavigator}
              options={{ headerShown: false }}
              initialParams={{httpClient: this.httpClient, storage: this.storage}}
            />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  async componentDidMount() {
    this.setState({ isLoaded: true });
    this.setState({ isSignedIn: true });
    return;
    this.httpClient.sessionID = await this.storage.getSessionID();
    if (this.httpClient.sessionID) {
      // TODO: заменить на парсер
      // let html = await this.httpClient.getTimeTable();
      let studentData = true;
      this.studentData = studentData;

      if (studentData) {
        this.setState({ isLoaded: true });
        this.setState({ isSignedIn: true });
      }
    }
  }
}

export default App;
