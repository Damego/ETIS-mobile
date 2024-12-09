import * as cheerio from 'cheerio';
import React, { useState } from 'react';
import { ToastAndroid, View } from 'react-native';
import { cache } from '~/cache/smartCache';
import { Button } from '~/components/Button';
import PasswordInput from '~/components/PasswordInput';
import Screen from '~/components/Screen';
import Text from '~/components/Text';
import { styles } from '~/components/education/auth/AuthForm';
import { useAppDispatch, useAppSelector, useGlobalStyles } from '~/hooks';
import { useAppTheme } from '~/hooks/theme';
import { getTextField } from '~/parser/utils';
import { setUserCredentials } from '~/redux/reducers/accountSlice';
import { httpClient } from '~/utils';
import { fontSize } from '~/utils/texts';


const changePassword = async (oldPassword: string, newPassword: string): Promise<string> => {
  const response = await httpClient.changePassword(oldPassword, newPassword);
  const $ = cheerio.load(response.data);

  const error = $('.error');
  if (error.length) {
    return getTextField(error);
  }
};

const Form = ({
  onSubmit,
  showLoading,
}: {
  onSubmit: (password: string) => void;
  showLoading: boolean;
}) => {
  const theme = useAppTheme();
  const globalStyles = useGlobalStyles();

  const [newPassword, setNewPassword] = useState<string>();
  const [newPasswordConfirm, setNewPasswordConfirm] = useState<string>();
  const [firstInputMessage, setFirstInputMessage] = useState<string>();

  const hasPasswords = newPassword && newPasswordConfirm;
  const passwordHasEightSymbols = newPassword && newPassword.length >= 8;
  const passwordConfirmed = hasPasswords && newPassword === newPasswordConfirm;
  const passwordUnconfirmed = hasPasswords && newPassword !== newPasswordConfirm;
  const validateFirstInput = () => {
    if (firstInputMessage) {
      setFirstInputMessage('');
    }

    if (newPassword && newPassword.length < 8) {
      setFirstInputMessage('Длина пароля должна быть не менее 8 символов');
    }
  };

  const preSubmit = () => {
    if (passwordUnconfirmed) return;

    onSubmit(newPassword);
  };

  return (
    <View
      style={{
        gap: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '35%',
      }}
    >
      <Text style={[fontSize.xlarge, { fontWeight: '500' }]}>Придумайте пароль</Text>
      <Text style={{ textAlign: 'center' }}>
        Пароль должен состоять как минимум из 8 символом. Также рекомендуем использовать цифры и
        специальные символы
      </Text>

      <PasswordInput
        style={[
          styles.input,
          globalStyles.border,
          globalStyles.textColor,
          newPassword && !passwordHasEightSymbols
            ? { borderColor: theme.colors.primary }
            : undefined,
        ]}
        onChangeText={setNewPassword}
        placeholder="Придумайте пароль"
        placeholderTextColor={theme.colors.inputPlaceholder}
        autoComplete="password-new"
        selectionColor={theme.colors.primary}
        onEndEditing={validateFirstInput}
        iconColor={theme.colors.text}
      />
      {firstInputMessage && <Text style={[globalStyles.primaryText]}>{firstInputMessage}</Text>}

      <PasswordInput
        style={[
          styles.input,
          globalStyles.border,
          globalStyles.textColor,
          passwordUnconfirmed ? { borderColor: theme.colors.primary } : undefined,
        ]}
        onChangeText={setNewPasswordConfirm}
        placeholder="Повторите пароль"
        placeholderTextColor={theme.colors.inputPlaceholder}
        autoComplete="password"
        selectionColor={theme.colors.primary}
        iconColor={theme.colors.text}
      />

      <View style={{ width: '90%' }}>
        <Button
          text={'Сменить'}
          onPress={preSubmit}
          disabled={!passwordHasEightSymbols || !passwordConfirmed}
          showLoading={showLoading}
          variant={'primary'}
        />
      </View>
    </View>
  );
};

export default function ChangePassword() {
  const dispatch = useAppDispatch();
  const globalStyles = useGlobalStyles();

  const [isLoading, setLoading] = useState<boolean>(false);
  const oldPassword = useAppSelector((state) => state.account.userCredentials.password);
  const [passwordChanged, setPasswordChanged] = useState<boolean>(false);

  const submit = async (password: string) => {
    setLoading(true);

    const error = await changePassword(oldPassword, password);
    if (error) ToastAndroid.show(error, ToastAndroid.LONG);
    else {
      const userCredentials = {
        ...(await cache.getUserCredentials()),
        password,
      };

      await cache.placeUserCredentials(userCredentials);
      dispatch(setUserCredentials({ userCredentials, fromStorage: true }));
      setPasswordChanged(true);
    }
    setLoading(false);
  };

  return (
    <Screen>
      {!passwordChanged ? (
        <Form onSubmit={submit} showLoading={isLoading} />
      ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={[globalStyles.textColor, fontSize.xlarge, { fontWeight: '500' }]}>
            Пароль успешно изменён!
          </Text>
        </View>
      )}
    </Screen>
  );
}
