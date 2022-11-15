"use strict";
import React, { Component } from "react";
import { Text, SafeAreaView } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";

import TimeTablePage from "./components/screens/timeTable/TimeTable";

import AuthPage from "./components/screens/Auth";
import TabNavigator from "./components/TabNavigation";

import HTTPClient from "./utils/http";
import Storage from "./utils/storage";
import DataParsing from "./utils/parser";

const Stack = createNativeStackNavigator();

class App extends Component {
  constructor() {
    super();
    this.state = {
      isSignedIn: false,
      isLoaded: false,
    };

    this.httpClient = new HTTPClient();
    this.storage = new Storage();
    this.parser = new DataParsing();
  }

  changeSingInState() {
    this.setState({ isSignedIn: true });
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
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              contentStyle: {
                backgroundColor: "#FFFFFF",
              },
            }}
          >
            {!this.state.isSignedIn ? (
              <Stack.Screen
                name="Authorization"
                options={{ headerShown: false }}
                screenOptions={{
                  contentStyle: {
                    backgroundColor: "#FFFFFF",
                  },
                }}
              >
                {(props) => (
                  <AuthPage
                    {...props}
                    httpClient={this.httpClient}
                    storage={this.storage}
                    onSignIn={() => this.changeSingInState()}
                  />
                )}
              </Stack.Screen>
            ) : (
              <Stack.Screen
                name="Navigator"
                options={{ headerShown: false }}
                screenOptions={{
                  contentStyle: {
                    backgroundColor: "#FFFFFF",
                  },
                }}
              >
                {(props) => (
                  <TabNavigator
                    {...props}
                    httpClient={this.httpClient}
                    storage={this.storage}
                    parser={this.parser}
                  />
                )}
              </Stack.Screen>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    );
  }

  async componentDidMount() {
    this.setState({ isLoaded: true });
    this.httpClient.sessionID = await this.storage.getSessionID();
    if (this.httpClient.sessionID && !(await this.isLoginPage())) {
      this.setState({ isSignedIn: true });
      return;
    }
  }

  async isLoginPage() {
    let html = await this.httpClient.getTimeTable();
    let data = this.parser.parseHeader(html);
    return !data;
  }
}

export default App;
