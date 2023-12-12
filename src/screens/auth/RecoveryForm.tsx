import React, { useState } from 'react';
import { Image, TextInput, View } from 'react-native';

import { Button } from '../../components/Button';
import ClickableText from '../../components/ClickableText';
import Text from '../../components/Text';
import { useAppSelector, useGlobalStyles } from '../../hooks';
import { useAppTheme } from '../../hooks/theme';
import { ThemeType } from '../../styles/themes';
import { fontSize } from '../../utils/texts';
import { styles } from './AuthForm';

const RecoveryForm = ({ onSubmit, isLoading, message, setShowModal, disabledRequestButton }) => {
  const globalStyles = useGlobalStyles();
  const theme = useAppTheme();
  const themeType = useAppSelector((state) => state.settings.theme);

  const [login, setLogin] = useState('');

  return (
    <View style={[styles.container, globalStyles.border, globalStyles.block]}>
      {/* TODO: Remove Halloween */}
      {themeType === ThemeType.halloween ? (
        <Image style={styles.logoImage} source={require('../../../assets/pumkin.gif')} />
      ) : (
        <Image style={styles.logoImage} source={require('../../../assets/logo_red.png')} />
      )}

      <Text>{message}</Text>

      <TextInput
        style={[styles.input, globalStyles.border, globalStyles.fontColorForBlock]}
        onChangeText={(newLogin) => {
          setLogin(newLogin);
        }}
        placeholder="Эл. почта"
        placeholderTextColor={theme.colors.inputPlaceholder}
        autoComplete="email"
        inputMode="email"
        keyboardType="email-address"
        selectionColor={theme.colors.primary}
        autoCapitalize="none"
        onSubmitEditing={() => onSubmit(login)}
      />

      <View style={{ width: '90%' }}>
        <Button
          text="Отправить письмо"
          onPress={() => onSubmit(login)}
          disabled={disabledRequestButton}
          showLoading={isLoading}
          variant={'secondary'}
        />
      </View>

      <ClickableText
        textStyle={[fontSize.large, globalStyles.textColor]}
        viewStyle={{ marginTop: '15%' }}
        text="Назад"
        onPress={() => setShowModal(false)}
      />
    </View>
  );
};

export default RecoveryForm;
