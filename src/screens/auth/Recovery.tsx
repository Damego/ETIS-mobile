// TODO: Refactor this component
import React, { useState } from 'react';

import CustomReCaptcha from '../../components/ReCaptcha';
import Screen from '../../components/Screen';
import { httpClient } from '../../utils';
import Footer from './AuthFooter';
import RecoveryForm from './RecoveryForm';

const Recovery = ({ setShowModal }) => {
  const [isLoading, setLoading] = useState<boolean>();
  const [message, changeMessage] = useState(null);
  const [recaptchaToken, setRecaptchaToken] = useState();
  const [disabledRequestButton, setDisabledRequestButton] = useState(false);
  const [isInvisibleRecaptcha, setIsInvisibleRecaptcha] = useState<boolean>(true);

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

    const res = await httpClient.sendRecoveryMail(mail, recaptchaToken);
    setRecaptchaToken(null);

    setLoading(false);

    if (res && res.error) {
      if (res.error.message.toLowerCase().includes('проверк')) {
        setIsInvisibleRecaptcha(false);
      } else changeMessage(res.error.message);
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
      {!recaptchaToken && (
        <CustomReCaptcha
          onReceiveToken={onReceiveRecaptchaToken}
          size={isInvisibleRecaptcha ? 'invisible' : 'normal'}
        />
      )}

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
