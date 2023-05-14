import Constants from 'expo-constants';
import { StatusBar } from 'expo-status-bar';
import React, { useContext, useState } from 'react';
import { View } from 'react-native';

import Header from '../../components/Header';
import ReCaptcha from '../../components/ReCaptcha';
import AuthContext from '../../context/AuthContext';
import { httpClient } from '../../utils';
import Footer from '../auth/AuthFooter';
import SendEmailForm from './SendEmailForm';

const SendEmailModal = ({ setShowModal }) => {
  const { showLoading } = useContext(AuthContext);
  const [isLoading, setLoading] = useState(showLoading);
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
    <View style={{ marginTop: Constants.statusBarHeight }}>
      <StatusBar style="dark" />

      {!recaptchaToken && <ReCaptcha onReceiveToken={onReceiveRecaptchaToken} />}

      <Header text="Восстановление доступа" />

      <SendEmailForm
        onSubmit={(mail) => makeRequest({ mail })}
        isLoading={isLoading}
        message={message}
        setShowModal={setShowModal}
        disabledRequestButton={disabledRequestButton}
      />

      <Footer />
    </View>
  );
};

export default SendEmailModal;