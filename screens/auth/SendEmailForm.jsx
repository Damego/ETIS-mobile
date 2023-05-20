import React, { useState } from 'react';
import { Image, Text, TextInput, View } from 'react-native';

import { Button, LoadingButton } from '../../components/Button';
import { GLOBAL_STYLES } from '../../styles/styles';
import { styles } from './AuthForm';
import BackButton from './BackButton';

const Message = ({ messageText }) => (
  <View>
    <Text>{messageText}</Text>
  </View>
);

const SendEmailForm = ({ onSubmit, isLoading, message, setShowModal, disabledRequestButton }) => {
  const [login, setLogin] = useState('');

  return (
    <View style={[styles.container, GLOBAL_STYLES.shadow]}>
      <Image style={styles.logoImage} source={require('../../assets/logo_red.png')} />

      <Message messageText={message} />

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
      <View style={{marginTop: '15%'}}>
        <BackButton onPress={() => setShowModal(false)} />
      </View>
    </View>
  );
};

export default SendEmailForm;
