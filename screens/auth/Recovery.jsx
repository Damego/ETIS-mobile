// TODO: Simplify this component
import Constants from 'expo-constants';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { View, useColorScheme } from 'react-native';

import Header from '../../components/Header';
import ReCaptcha from '../../components/ReCaptcha';
import { httpClient } from '../../utils';
import Footer from './AuthFooter';
import RecoveryForm from './RecoveryForm';

const Recovery = ({ setShowModal }) => {
  const scheme = useColorScheme();

  const [isLoading, setLoading] = useState();
  const [message, changeMessage] = useState(null);
  const [recaptchaToken, setRecaptchaToken] = useState();
  const [disabledRequestButton, setDisabledRequestButton] = useState(false);

  const makeRequest = async ({ mail }) => {
    if (isLoading || disabledRequestButton) return;

    if (!mail) {
      changeMessage('Вы не ввели почту');
      return;
    }

    if (!recaptchaToken) {
      changeMessage('Токен авторизации не найден. Подождите немного');
      return;
    }

    setLoading(true);

    const { errorMessage } = await httpClient.sendRecoveryMail(mail, recaptchaToken);
    setRecaptchaToken(null);

    setLoading(false);

    if (errorMessage) {
      changeMessage(errorMessage);
      return;
    }

    setDisabledRequestButton(true);
    changeMessage('Письмо успешно отправлено.');
  };

  const onReceiveRecaptchaToken = async (token) => {
    setRecaptchaToken(token);
  };

  return (
    <>
      <View style={{ marginTop: Constants.statusBarHeight }}>
        <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />

        {!recaptchaToken && <ReCaptcha onReceiveToken={onReceiveRecaptchaToken} />}

        <Header text="Восстановление доступа" />

        <RecoveryForm
          onSubmit={(mail) => makeRequest({ mail })}
          isLoading={isLoading}
          message={message}
          setShowModal={setShowModal}
          disabledRequestButton={disabledRequestButton}
        />
      </View>
      <Footer />
    </>
  );
};

export default Recovery;
