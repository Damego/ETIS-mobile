import { Checkbox } from 'expo-checkbox';
import React, { useState } from 'react';
import { Image, StyleSheet, TextInput, View } from 'react-native';
import { Button } from '~/components/Button';
import ClickableText from '~/components/ClickableText';
import PasswordInput from '~/components/PasswordInput';
import Text from '~/components/Text';
import { useAppDispatch, useAppSelector, useGlobalStyles } from '~/hooks';
import { useAppTheme } from '~/hooks/theme';
import { setSaveUserCredentials } from '~/redux/reducers/accountSlice';
import { fontSize } from '~/utils/texts';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 16,
  },
  logoImage: {
    width: 130,
    height: 130,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  checkbox: {
    marginRight: '2%',
  },
  input: {
    paddingLeft: '2%',
    paddingVertical: '3%',
    width: '100%',
  },
  authPropContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
});

const Form = ({ onSubmit, errorMessage, setShowRecovery }) => {
  const dispatch = useAppDispatch();
  const { saveUserCredentials } = useAppSelector((state) => state.account);
  const globalStyles = useGlobalStyles();
  const theme = useAppTheme();

  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const toggleSaveUserCredentials = (value: boolean) => {
    dispatch(setSaveUserCredentials(value));
  };

  return (
    <View style={styles.container}>
      <Image style={styles.logoImage} source={require('../../../../assets/logo_red.png')} />

      <Text colorVariant={'primary'}>{errorMessage}</Text>

      <TextInput
        style={[styles.input, globalStyles.border, globalStyles.textColor, fontSize.large]}
        onChangeText={(newLogin) => {
          setLogin(newLogin);
        }}
        placeholder="Эл. почта / фамилия"
        placeholderTextColor={theme.colors.inputPlaceholder}
        autoComplete="email"
        inputMode="email"
        keyboardType="email-address"
        selectionColor={theme.colors.primary}
        autoCapitalize="none"
      />
      <PasswordInput
        style={[styles.input, globalStyles.border, globalStyles.textColor, fontSize.large]}
        containerStyle={{width: '100%'}}
        onChangeText={setPassword}
        placeholder="Пароль"
        placeholderTextColor={theme.colors.inputPlaceholder}
        autoComplete="password"
        selectionColor={theme.colors.primary}
        onSubmitEditing={() => onSubmit(login, password)}
        iconColor={theme.colors.text}
        autoCapitalize={'none'}
      />

      <View style={styles.authPropContainer}>
        <View style={styles.checkboxContainer}>
          <Checkbox
            color={theme.colors.primary}
            style={styles.checkbox}
            value={saveUserCredentials}
            onValueChange={toggleSaveUserCredentials}
          />
          <Text style={fontSize.small} colorVariant={'primary'}>
            Запомнить меня
          </Text>
        </View>

        <ClickableText
          textStyle={fontSize.small}
          text="Забыли пароль?"
          onPress={() => setShowRecovery(true)}
          colorVariant={'text2'}
        />
      </View>

      <View style={{ width: '100%' }}>
        <Button text="Войти" onPress={() => onSubmit(login, password)} variant={'primary'} />
      </View>
    </View>
  );
};

export default Form;
