import React from 'react';
import ReCaptchaV3 from '@haskkor/react-native-recaptchav3';

export default function ReCaptcha({onReceiveToken}) {
  return (
    <ReCaptchaV3
      action="submit"
      captchaDomain="https://student.psu.ru"
      siteKey="6LfeYf8UAAAAAIF22Cn9YFwXlZk1exjVNyF2Jmo6"
      onReceiveToken={onReceiveToken}
    />
  )
}