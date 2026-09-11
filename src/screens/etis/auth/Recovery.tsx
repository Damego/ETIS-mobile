import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import Screen from '~/components/Screen';
import { httpClient } from '~/utils';

import Footer from './AuthFooter';
import RecoveryForm from './RecoveryForm';

const Recovery = ({ setShowModal }: { readonly setShowModal: (showModal: boolean) => void }) => {
  const { t } = useTranslation();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [message, changeMessage] = useState<string | null>(null);
  const [disabledRequestButton, setDisabledRequestButton] = useState(false);

  const makeRequest = async ({ mail }: { mail: string }) => {
    if (isLoading || disabledRequestButton) return;

    if (!mail) {
      changeMessage(t('auth.enterEmail'));
      return;
    }

    setLoading(true);

    const res = await httpClient.sendRecoveryMail(mail);
    setLoading(false);

    if (res && res.error) {
      changeMessage(res.error.message);
      return;
    }

    setDisabledRequestButton(true);
    changeMessage(t('auth.recoveryMailSent'));
  };

  return (
    <Screen>
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
