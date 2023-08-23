import React, { useEffect, useRef } from 'react';
import Recaptcha, { RecaptchaHandles } from 'react-native-recaptcha-that-works';

const PUBLIC_KEY_V3 = '6LfeYf8UAAAAAIF22Cn9YFwXlZk1exjVNyF2Jmo6';
const PUBLIC_KEY_V2 = '6LfEEFYdAAAAAIG5yJbJypumbx-jfqfiHKRu8AC0';

export default function CustomReCaptcha({
  onReceiveToken,
  size,
  onClose,
}: {
  onReceiveToken(token: string): void;
  size: 'invisible' | 'normal';
  onClose?(): void;
}) {
  const ref = useRef<RecaptchaHandles>();

  useEffect(() => {
    ref.current.open();
  }, [size]);

  return (
    <Recaptcha
      ref={ref}
      baseUrl="https://student.psu.ru"
      siteKey={size === 'invisible' ? PUBLIC_KEY_V3 : PUBLIC_KEY_V2}
      onVerify={onReceiveToken}
      size={size}
      onClose={onClose}
      hideBadge={true}
      loadingComponent={<></>}
      style={size === 'invisible' ? { backgroundColor: undefined } : undefined}
    />
  );
}
