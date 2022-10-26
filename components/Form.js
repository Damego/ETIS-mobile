import React, { Component } from "react";
import { StyleSheet, View, TextInput, Button } from "react-native";
import ReCaptchaV3 from "@haskkor/react-native-recaptchav3";

class Form extends Component {
  states = {
    login: "",
    password: "",
    token: "",
  };

  render() {
    return (
      <View>
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
        />
        <Button
          title="Войти"
          onPress={() => {
            this.props.defaultAuth(this.login, this.password, this.token);
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    borderBottomWidth: 1,
    borderColor: "#C62E3E",
    padding: 10,
    marginVertical: 30,
    marginHorizontal: "20%",
    width: "60%",
  },
});

export default Form;
