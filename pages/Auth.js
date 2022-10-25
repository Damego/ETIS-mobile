import React, { Component } from "react";
import { SafeAreaView } from "react-native";
import Form from "../components/AuthForm";
import Header from "../components/Header";
import Footer from "../components/AuthFooter";

export default class FormPage extends Component {
  render() {
    return (
      <SafeAreaView>
        <Header />
        <Form onSubmit={this.props.onSubmit} />
        <Footer />
      </SafeAreaView>
    );
  }
}
