import React, { useState } from 'react';
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
  onSubmit: (login: string) => void;
  isLoading?: boolean;
  message: string | null;
  setShowModal: (showModal: boolean) => void;
  disabledRequestButton: boolean;
}) => {
  const globalStyles = useGlobalStyles();
  const theme = useAppTheme();

  const [login, setLogin] = useState('');

  return (
    <View style={styles.container}>
      <Image style={styles.logoImage} source={require('../../../../assets/logo_red.png')} />

      <Text
        style={[
          message?.includes('отправлено')
            ? [globalStyles.primaryText, { fontWeight: '600', textAlign: 'center' }]
            : { textAlign: 'center' },
        ]}
      >
        {message}
      </Text>

      <TextInput
        style={[styles.input, globalStyles.border, globalStyles.textColor2]}
        onChangeText={(newLogin) => {
          setLogin(newLogin);
        }}
        placeholder='Эл. почта'
        placeholderTextColor={theme.colors.inputPlaceholder}
        autoComplete='email'
        inputMode='email'
        keyboardType='email-address'
        selectionColor={theme.colors.primary}
        autoCapitalize='none'
        onSubmitEditing={() => onSubmit(login)}
      />

      <View style={{ width: '100%', marginTop: '2%' }}>
        <Button
          text='Отправить письмо'
          onPress={() => onSubmit(login)}
          disabled={disabledRequestButton}
          showLoading={isLoading}
          variant={'primary'}
        />
      </View>

      <View style={{ width: '100%', marginTop: '4%' }}>
        <Button text='Назад' onPress={() => setShowModal(false)} variant={'secondary'} />
      </View>
    </View>
  );
};

export default RecoveryForm;
