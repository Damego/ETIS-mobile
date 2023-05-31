import ReCaptcha from './ReCaptcha';
import { ActivityIndicator, ToastAndroid, View, StyleSheet, Text } from 'react-native';
import { useAppDispatch, useAppSelector, useGlobalStyles } from '../hooks';
import { setAuthorizing, signIn } from '../redux/reducers/authSlice';
import { httpClient, storage } from '../utils';

const styles = StyleSheet.create({
  modalWrapper: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    width: '100%',
    height: '100%'
  },
  modalContainer: {
    backgroundColor: '#DDD',
    borderRadius: 10,
    padding: '15%',
    alignItems: 'center',
    justifyContent: 'center',
  }
})

const makeLogin = async (token, userCredentials, saveUserCredentials) => {
  if (!token) {
    // TODO: make auto attempt
    ToastAndroid.show('Токен авторизации не найден. Подождите немного', ToastAndroid.SHORT);
    return false;
  }
  const { errorMessage } = await httpClient.login(userCredentials.login, userCredentials.password, token);

  if (errorMessage) {
    ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
    return;
  }

  if (saveUserCredentials) {
    await storage.storeAccountData(userCredentials.login, userCredentials.password);
  }
  return true;
};

const AuthLoadingModal = () => {
  const dispatch = useAppDispatch();
  const {userCredentials, saveUserCredentials} = useAppSelector(state => state.auth);

  const globalStyles = useGlobalStyles();

  const onReceiveToken = async (token: string) => {
    const success = await makeLogin(token, userCredentials, saveUserCredentials);

    if (success === true) {
      dispatch(signIn());
      dispatch(setAuthorizing(false));
    }
    else {
      console.warn('pizdec')
    }
  }

  return (
    <View style={styles.modalWrapper}>
      <View style={styles.modalContainer}>
        <ReCaptcha onReceiveToken={onReceiveToken} />
        <ActivityIndicator size='large' color={globalStyles.primaryFontColor.color}/>
        <Text>Авторизация...</Text>
      </View>
    </View>
  )
}

export default AuthLoadingModal;