import Constants from 'expo-constants';
import React from 'react';
import { Linking, StyleSheet, View } from 'react-native';

import ClickableText from '../../components/ClickableText';
import Screen from '../../components/Screen';
import Text from '../../components/Text';
import { useGlobalStyles } from '../../hooks';
import { PRIVACY_POLICY_URL } from '../../utils';
import { fontSize } from '../../utils/texts';

const styles = StyleSheet.create({
  view: {
    alignItems: 'center',
    position: 'absolute',
    bottom: '1%',
    left: 0,
    right: 0,
  },
});

const About = () => {
  const globalStyles = useGlobalStyles();

  return (
    <Screen>
      <Text style={fontSize.medium}>
        ЕТИС мобайл - это неофициальное мобильное приложение для ЕТИС ПГНИУ. Приложение позволяет в
        удобном режиме пользоваться ЕТИС используя ваш смартфон.
      </Text>
      <Text style={fontSize.medium}>
        Приложение ЕТИС мобайл и его разработчики никак не связаны с ЕТИС ПГНИУ и с его
        разработчиками. Доступ к основному функционалу приложения доступен только, если вы являетесь
        студентом ПГНИУ и у вас имеется логин и пароль для входа в систему.
      </Text>
      <Text style={fontSize.medium}>
        Приложение не собирает и не распространяет никакую информацию связанную с ЕТИС. Приложение
        сохраняет ваш логин и пароль на ваше устройство для последующей авторизации в ЕТИС.
      </Text>

      <View style={styles.view}>
        <ClickableText
          textStyle={[fontSize.medium, globalStyles.primaryFontColor, { fontWeight: '500' }]}
          text={'Политика конфиденциальности'}
          onPress={() => Linking.openURL(PRIVACY_POLICY_URL)}
        />
        <Text style={fontSize.medium}>Версия приложения: {Constants.expoConfig.version}</Text>
      </View>
    </Screen>
  );
};

export default About;
