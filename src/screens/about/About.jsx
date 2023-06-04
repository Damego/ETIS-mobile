import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Constants from "expo-constants"

import Screen from '../../components/Screen';
import { useGlobalStyles } from '../../hooks';

const styles = StyleSheet.create({
  text: {
    fontSize: 18,
  },
  view: {
    alignItems: "center",
    position: 'absolute',
    bottom: "1%",
    left: 0,
    right: 0
  }
})

const About = () => {
  const globalStyles = useGlobalStyles();
  const textStyles = [styles.text, globalStyles.textColor]

  return (
    <Screen disableRefresh>
      <Text style={textStyles}>
        ЕТИС мобайл - это неофициальное мобильное приложение для ЕТИС ПГНИУ. Приложение позволяет в удобном режиме пользоваться ЕТИС используя ваш смартфон.
      </Text>
      <Text style={textStyles}>
        Приложение ЕТИС мобайл и его разработчики никак не связаны с ЕТИС ПГНИУ и с его разработчиками.
        Доступ к основному функционалу приложения доступен только, если вы являетесь студентом ПГНИУ и у вас имеется логин и пароль для входа в систему.
      </Text>
      <Text style={textStyles}>
        Приложение не собирает и не распространяет никакую информацию связанную с ЕТИС.
        Приложение сохраняет ваш логин и пароль на ваше устройство для последующей авторизации в ЕТИС.
      </Text>

      <View style={styles.view}>
        <Text style={textStyles}>
          Версия приложения: {Constants.manifest.version}
        </Text>
      </View>
    </Screen>
  )
}

export default About;