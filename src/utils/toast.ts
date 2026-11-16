import { Alert, Platform, ToastAndroid } from 'react-native';

type ToastDuration = 'short' | 'long';

/**
 * Кроссплатформенная замена прямых вызовов ToastAndroid: на iOS нативных
 * тостов нет — показываем системный Alert с кнопкой OK.
 */
const showToast = (message: string, duration: ToastDuration = 'short') => {
  if (Platform.OS === 'android') {
    ToastAndroid.show(message, duration === 'long' ? ToastAndroid.LONG : ToastAndroid.SHORT);
    return;
  }
  Alert.alert(message);
};

export { showToast };
