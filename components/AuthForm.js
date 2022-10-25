import React, { Component } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
} from "react-native";
import ReCaptchaV3 from "@haskkor/react-native-recaptchav3";
import AuthButton from "./AuthButton";

class Form extends Component {
  states = {
    login: "",
    password: "",
    token: "",
  };

  render() {
    return (
      <View style={styles.view}>
        <ReCaptchaV3
          action={"submit"}
          captchaDomain={"https://student.psu.ru"}
          siteKey={"6LfeYf8UAAAAAIF22Cn9YFwXlZk1exjVNyF2Jmo6"}
          onReceiveToken={(token) => {
            this.token = token;
          }}
        />
        <TextInput
          style={styles.input}
          onChangeText={(login) => {
            this.login = login;
          }}
          placeholder="Логин"
        />
        <TextInput
          style={styles.input}
          onChangeText={(password) => {
            this.password = password;
          }}
          placeholder="Пароль"
          secureTextEntry={true}
        />

        <AuthButton
          onPress={() => {
            this.props.onSubmit(this.login, this.password, this.token);
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    marginVertical: "50%",
  },
  input: {
    fontSize: 20,
    borderBottomWidth: 1,
    borderColor: "#C62E3E",
    padding: 10,
    marginVertical: 20,
    marginHorizontal: "10%",
    width: "80%",
  },
});

export default Form;
