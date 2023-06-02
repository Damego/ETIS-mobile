import React from 'react';
import ReCaptchaV3 from '@haskkor/react-native-recaptchav3';

export default function ReCaptcha({onReceiveToken, captchaRef}) {
  return (
    <ReCaptchaV3
      ref={captchaRef}
      action="submit"
      captchaDomain="https://student.psu.ru"
      siteKey="6LfeYf8UAAAAAIF22Cn9YFwXlZk1exjVNyF2Jmo6"
      onReceiveToken={onReceiveToken}
    />
  )
}