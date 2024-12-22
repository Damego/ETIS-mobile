import React from 'react';
import CustomReCaptcha from '~/components/ReCaptcha';
import useAuth from '~/hooks/useAuth';

const InvisibleAuthModal = () => {
  const auth = useAuth();

  const onReceiveToken = async (token: string) => {
    await auth.login(token, true);
  };

  return <CustomReCaptcha onReceiveToken={onReceiveToken} size={'invisible'} />;
};

export default InvisibleAuthModal;
