// TODO: Refactor this component
import React, { useState } from 'react';
import { View } from 'react-native';

import CustomReCaptcha from '~/components/ReCaptcha';
import Screen from '~/components/Screen';
import { httpClient } from '~/utils';

import Footer from './AuthFooter';
import RecoveryForm from './RecoveryForm';

const Recovery = ({ setShowModal }: { setShowModal: (showModal: boolean) => void }) => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [message, changeMessage] = useState<string | null>(null);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [disabledRequestButton, setDisabledRequestButton] = useState(false);
  const [isInvisibleRecaptcha, setIsInvisibleRecaptcha] = useState<boolean>(true);

  const makeRequest = async ({ mail }: { mail: string }) => {
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

  const onReceiveRecaptchaToken = async (token: string) => {
    setRecaptchaToken(token);
  };

  return (
    <Screen>
      {!recaptchaToken && (
        <CustomReCaptcha
          onReceiveToken={onReceiveRecaptchaToken}
          size={isInvisibleRecaptcha ? 'invisible' : 'normal'}
        />
      )}

      <View style={{ flex: 1 }}>
        <RecoveryForm
          onSubmit={(mail: string) => makeRequest({ mail })}
          isLoading={isLoading}
          message={message}
          setShowModal={setShowModal}
          disabledRequestButton={disabledRequestButton}
        />
      </View>
      <Footer />
    </Screen>
  );
};

export default Recovery;
