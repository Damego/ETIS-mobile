import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, TextInput, View } from 'react-native';

import { Button } from '~/components/Button';
import ClickableText from '~/components/ClickableText';
import Text from '~/components/Text';
import { useGlobalStyles } from '~/hooks';
import { useAppTheme } from '~/hooks/theme';
import { fontSize } from '~/utils/texts';

import { styles } from './AuthForm';

const RecoveryForm = ({
  onSubmit,
  isLoading,
  message,
  setShowModal,
  disabledRequestButton,
}: {
  readonly onSubmit: (login: string) => void;
  readonly isLoading?: boolean;
  readonly message: string | null;
  readonly setShowModal: (showModal: boolean) => void;
  readonly disabledRequestButton: boolean;
}) => {
  const { t } = useTranslation();
  const globalStyles = useGlobalStyles();
  const theme = useAppTheme();

  const [login, setLogin] = useState('');

  return (
    <View style={styles.container}>
      <Image style={styles.logoImage} source={require('../../../../assets/logo_red.png')} />

      <Text
        style={[
          message === t('auth.recoveryMailSent')
            ? [globalStyles.primaryText, { fontWeight: '600', textAlign: 'center' }]
            : { textAlign: 'center' },
        ]}
      >
        {message}
      </Text>

      <TextInput
        style={[styles.input, globalStyles.border, globalStyles.textColor2]}
        placeholder={t('auth.emailPlaceholder')}
        placeholderTextColor={theme.colors.inputPlaceholder}
        autoComplete='email'
        inputMode='email'
        keyboardType='email-address'
        selectionColor={theme.colors.primary}
        autoCapitalize='none'
        onChangeText={(newLogin) => {
          setLogin(newLogin);
        }}
        onSubmitEditing={() => onSubmit(login)}
      />

      <View style={{ width: '100%', marginTop: '2%' }}>
        <Button
          text={t('auth.sendRecoveryMail')}
          disabled={disabledRequestButton}
          showLoading={isLoading}
          variant={'primary'}
          onPress={() => onSubmit(login)}
        />
      </View>

      <View style={{ width: '100%', marginTop: '4%' }}>
        <Button text={t('common.back')} variant={'secondary'} onPress={() => setShowModal(false)} />
      </View>
    </View>
  );
};

export default RecoveryForm;
