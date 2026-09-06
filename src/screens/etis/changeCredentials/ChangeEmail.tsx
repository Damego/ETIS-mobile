import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TextInput, ToastAndroid, View } from 'react-native';

import { cache } from '~/cache/smartCache';
import { Button } from '~/components/Button';
import CenteredText from '~/components/CenteredText';
import Screen from '~/components/Screen';
import Text from '~/components/Text';
import { useAppDispatch, useGlobalStyles } from '~/hooks';
import { useAppTheme } from '~/hooks/theme';
import { EducationStackScreenProps } from '~/navigation/types';
import { parseChangeEmailPage } from '~/parser/changeCredentials';
import { setUserCredentials } from '~/redux/reducers/accountSlice';
import { httpClient } from '~/utils';
import { fontSize } from '~/utils/texts';

import { styles } from '../auth/AuthForm';

const emailRegex = /(.+)@(.+){2,}\.(.+){2,}/;
const changeEmail = async (email: string) => {
  const response = await httpClient.changeEmail(email);
  const error = parseChangeEmailPage(response.data ?? '');
  if (error) return error;

  // Хотя в ЕТИСе сказано, что письмо было отправлено, но на самом деле нет.
  // Поэтому отправляем самостоятельно
  await httpClient.sendVerificationMail();
};

const Form = ({
  onSubmit,
  showLoading,
}: {
  readonly onSubmit: (email: string) => void;
  readonly showLoading: boolean;
}) => {
  const { t } = useTranslation();
  const globalStyles = useGlobalStyles();
  const theme = useAppTheme();

  const [email, setEmail] = useState<string>('');

  return (
    <View
      style={{
        gap: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '35%',
      }}
    >
      <Text style={[fontSize.xlarge, { fontWeight: '600' }]}>
        {t('changeCredentials.emailTitle')}
      </Text>
      <Text>{t('changeCredentials.emailDescription')}</Text>
      <TextInput
        style={[
          styles.input,
          globalStyles.border,
          globalStyles.textColor,
          email && !emailRegex.test(email) ? { borderColor: theme.colors.primary } : undefined,
        ]}
        placeholder={t('changeCredentials.emailPlaceholder')}
        placeholderTextColor={theme.colors.inputPlaceholder}
        autoComplete='email'
        inputMode='email'
        keyboardType='email-address'
        selectionColor={theme.colors.primary}
        autoCapitalize='none'
        onChangeText={setEmail}
      />
      <View style={{ width: '90%' }}>
        <Button
          text={t('changeCredentials.changeButton')}
          disabled={!email || !emailRegex.test(email)}
          showLoading={showLoading}
          variant={'primary'}
          onPress={() => onSubmit(email)}
        />
      </View>
    </View>
  );
};

export default function ChangeEmail({ route }: EducationStackScreenProps<'ChangeEmail'>) {
  const { t } = useTranslation();
  const sendVerificationMail = route.params?.sendVerificationMail;

  const dispatch = useAppDispatch();
  const [isLoading, setLoading] = useState(false);
  const [mailSent, setMailSent] = useState(false);

  const submit = async (email: string) => {
    setLoading(true);

    const error = await changeEmail(email);
    if (error) {
      ToastAndroid.show(error, ToastAndroid.LONG);
      setLoading(false);
      return;
    }

    setMailSent(true);

    let userCredentials = await cache.getUserCredentials();
    if (userCredentials && emailRegex.test(userCredentials.login)) {
      userCredentials = { ...userCredentials, login: email };
      cache.placeUserCredentials(userCredentials);
      dispatch(setUserCredentials({ userCredentials, fromStorage: true }));
    }

    setLoading(false);
  };

  useEffect(() => {
    if (!sendVerificationMail) return;

    httpClient.sendVerificationMail().then(() => {
      setMailSent(true);
    });
  }, [sendVerificationMail]);

  let component: React.ReactNode;
  if (mailSent)
    component = (
      <CenteredText>{t('changeCredentials.verificationMailSent')}</CenteredText>
    );
  else if (sendVerificationMail)
    component = <CenteredText>{t('changeCredentials.sending')}</CenteredText>;
  else component = <Form showLoading={isLoading} onSubmit={submit} />;

  return <Screen>{component}</Screen>;
}
