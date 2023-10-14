import { Checkbox } from 'expo-checkbox';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, View } from 'react-native';

import { Button } from '../../components/Button';
import ClickableText from '../../components/ClickableText';
import { useAppDispatch, useAppSelector, useGlobalStyles } from '../../hooks';
import { useAppTheme } from '../../hooks/theme';
import { setSaveUserCredentials } from '../../redux/reducers/authSlice';
import { fontSize } from '../../utils/texts';

export const styles = StyleSheet.create({
  container: {
    marginTop: '15%',
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: '4%',
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
    ...fontSize.large,
    paddingLeft: '2%',
    paddingVertical: '3%',
    width: '90%',
  },
  authPropContainer: {
    flexDirection: 'row',
    width: '90%',
    paddingHorizontal: 5,
    justifyContent: 'space-between',
  },
  forgotButton: {
    ...fontSize.small,
    color: '#427ADE',
  },
});

const Form = ({ onSubmit, errorMessage, setShowRecovery }) => {
  const dispatch = useAppDispatch();
  const { saveUserCredentials } = useAppSelector((state) => state.auth);
  const globalStyles = useGlobalStyles();
  const theme = useAppTheme();

  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const toggleSaveUserCredentials = (value: boolean) => {
    dispatch(setSaveUserCredentials(value));
  };

  return (
    <View style={[styles.container, globalStyles.border, globalStyles.block]}>
      <Image style={styles.logoImage} source={require('../../../assets/logo_red.png')} />

      <Text style={globalStyles.textColor}>{errorMessage}</Text>

      <TextInput
        style={[styles.input, globalStyles.border, globalStyles.textColor]}
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
      <TextInput
        style={[styles.input, globalStyles.border, globalStyles.textColor]}
        onChangeText={(newPassword) => {
          setPassword(newPassword);
        }}
        placeholder="Пароль"
        placeholderTextColor={theme.colors.inputPlaceholder}
        secureTextEntry
        autoComplete="password"
        selectionColor={theme.colors.primary}
        onSubmitEditing={() => onSubmit(login, password)}
      />

      <View style={styles.authPropContainer}>
        <View style={styles.checkboxContainer}>
          <Checkbox
            style={styles.checkbox}
            value={saveUserCredentials}
            onValueChange={toggleSaveUserCredentials}
          />
          <Text style={[fontSize.small, globalStyles.textColor]}>Запомнить пароль?</Text>
        </View>

        <ClickableText
          textStyle={styles.forgotButton}
          text="Забыли пароль?"
          onPress={() => setShowRecovery(true)}
        />
      </View>

      <View style={{width: '90%'}}>
        <Button text="Войти" onPress={() => onSubmit(login, password)} variant={'secondary'} />
      </View>
    </View>
  );
};

export default Form;
