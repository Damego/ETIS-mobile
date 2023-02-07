"use strict";
import React, { useState, useEffect } from "react";
import { Text, SafeAreaView } from "react-native";

import { vars } from "./utils/vars";

import StackNavigator from "./navigation/StackNavigation";

const App = () => {

  const [isSignedIn, setSignedIn] = useState(false);
  const [isLoaded, setLoaded] = useState(false);

  const isLoginPage = async () => {
    let html = await vars.httpClient.getTimeTable();
    let data = vars.parser.parseHeader(html);
    return !data;
  };

  useEffect(() => {
    if (isLoaded) return;

    const wrapper = async () => {
      setLoaded(true)
      vars.httpClient.sessionID = await vars.storage.getSessionID();

      if (vars.httpClient.sessionID && !(await isLoginPage())) {
        console.log("set sign in");
        setSignedIn(true);
      }
    }
    wrapper();
  });

  if (!isLoaded) {
    return (
      <SafeAreaView>
        <Text>{"Loading..."}</Text>
      </SafeAreaView>
    );
  }
  return <StackNavigator isSignedIn={isSignedIn} setSignedIn={setSignedIn} />;
};

export default App;