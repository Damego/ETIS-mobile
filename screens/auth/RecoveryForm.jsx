import React, { useState } from 'react';
import { Image, Text, TextInput, View } from 'react-native';

import { Button, LoadingButton } from '../../components/Button';
import ClickableText from '../../components/ClickableText';
import { useGlobalStyles } from '../../hooks';
import { styles } from './AuthForm';

const RecoveryForm = ({ onSubmit, isLoading, message, setShowModal, disabledRequestButton }) => {
  const globalStyles = useGlobalStyles();

  const [login, setLogin] = useState('');

  return (
    <View style={[styles.container, globalStyles.border]}>
      <Image style={styles.logoImage} source={require('../../assets/logo_red.png')} />

      <Text>{message}</Text>

      <TextInput
        style={[styles.input, globalStyles.border]}
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
        textStyle={{ fontSize: 20 }}
        viewStyle={{ marginTop: '15%' }}
        text="Назад"
        onPress={() => setShowModal(false)}
      />
    </View>
  );
};

export default RecoveryForm;
