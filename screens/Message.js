"use strict";

import React, { Component } from "react";
import { SafeAreaView } from "react-native";

import {Header} from "../components/Header";

export default class MessagesPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <SafeAreaView>
        <Header text={"ЕТИС | Сообщения"} />
      </SafeAreaView>
    );
  }
}
