import React, { useState } from 'react';
import { Image, Text, TextInput, View } from 'react-native';

import { Button, LoadingButton } from '../../components/Button';
import { GLOBAL_STYLES } from '../../styles/styles';
import { styles } from './AuthForm';
import ClickableText from '../../components/ClickableText';


const RecoveryForm = ({ onSubmit, isLoading, message, setShowModal, disabledRequestButton }) => {
  const [login, setLogin] = useState('');

  return (
    <View style={[styles.container, GLOBAL_STYLES.shadow]}>
      <Image style={styles.logoImage} source={require('../../assets/logo_red.png')} />

      <Text>{message}</Text>

      <TextInput
        style={[styles.input, GLOBAL_STYLES.shadow]}
        onChangeText={(newLogin) => {
          setLogin(newLogin);
        }}
        placeholder="Эл. почта"
        autoComplete="email"
        inputMode="email"
        keyboardType="email-address"
        selectionColor="#C62E3E"
        autoCapitalize="none"
        onSubmitEditing={() => onSubmit(login)}
      />

      {isLoading ? (
        <LoadingButton />
      ) : (
        <Button
          text="Отправить письмо"
          onPress={() => onSubmit(login)}
          disabled={disabledRequestButton}
        />
      )}

      <ClickableText
        textStyle={{fontSize: 20}}
        viewStyle={{marginTop: '15%'}}
        text="Назад"
        onPress={() => setShowModal(false)}
      />
    </View>
  );
};

export default RecoveryForm;
