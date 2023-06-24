// TODO: Simplify this component
import Constants from 'expo-constants';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { View } from 'react-native';

import Header from '../../components/Header';
import ReCaptcha from '../../components/ReCaptcha';
import Screen from '../../components/Screen';
import { useAppColorScheme } from '../../hooks/theme';
import { httpClient } from '../../utils';
import Footer from './AuthFooter';
import RecoveryForm from './RecoveryForm';

const Recovery = ({ setShowModal }) => {
  const [isLoading, setLoading] = useState();
  const [message, changeMessage] = useState(null);
  const [recaptchaToken, setRecaptchaToken] = useState();
  const [disabledRequestButton, setDisabledRequestButton] = useState(false);

  const statusBarStyle = useAppColorScheme() === 'dark' ? 'dark' : 'light';

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
    <Screen headerText={'Восстановление доступа'}>
      {!recaptchaToken && <ReCaptcha onReceiveToken={onReceiveRecaptchaToken} />}

      <RecoveryForm
        onSubmit={(mail) => makeRequest({ mail })}
        isLoading={isLoading}
        message={message}
        setShowModal={setShowModal}
        disabledRequestButton={disabledRequestButton}
      />
      <Footer />
    </Screen>
  );
};

export default Recovery;
