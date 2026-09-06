// TODO: Refactor this component
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import CustomReCaptcha from '~/components/ReCaptcha';
import Screen from '~/components/Screen';
import { httpClient } from '~/utils';

import Footer from './AuthFooter';
import RecoveryForm from './RecoveryForm';

const Recovery = ({ setShowModal }: { readonly setShowModal: (showModal: boolean) => void }) => {
  const { t } = useTranslation();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [message, changeMessage] = useState<string | null>(null);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [disabledRequestButton, setDisabledRequestButton] = useState(false);
  const [isInvisibleRecaptcha, setIsInvisibleRecaptcha] = useState<boolean>(true);

  const makeRequest = async ({ mail }: { mail: string }) => {
    if (isLoading || disabledRequestButton) return;

    if (!mail) {
      changeMessage(t('auth.enterEmail'));
      return;
    }

    if (!recaptchaToken) {
      changeMessage(t('auth.recaptchaTokenNotFound'));
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
    changeMessage(t('auth.recoveryMailSent'));
  };

  const onReceiveRecaptchaToken = async (token: string) => {
    setRecaptchaToken(token);
  };

  return (
    <Screen>
      {!recaptchaToken && (
        <CustomReCaptcha
          size={isInvisibleRecaptcha ? 'invisible' : 'normal'}
          onReceiveToken={onReceiveRecaptchaToken}
        />
      )}

      <View style={{ flex: 1 }}>
        <RecoveryForm
          isLoading={isLoading}
          message={message}
          setShowModal={setShowModal}
          disabledRequestButton={disabledRequestButton}
          onSubmit={(mail: string) => makeRequest({ mail })}
        />
      </View>
      <Footer />
    </Screen>
  );
};

export default Recovery;
