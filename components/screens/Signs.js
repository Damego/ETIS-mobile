"use strict";

import React, { Component } from "react";
import { SafeAreaView } from "react-native";

import Header from "../Header";

export default class SignsPage extends Component {
  constructor(props) {
    super(props);

    // this.storage = this.props.storage;
    // this.httpClient = this.props.httpClient;
  }

  render() {
    return (
      <SafeAreaView>
        <Header text={"ЕТИС | Оценки"} />
      </SafeAreaView>
    );
  }
}
