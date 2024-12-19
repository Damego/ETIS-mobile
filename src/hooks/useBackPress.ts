import { useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { BackHandler } from 'react-native';

/*
 * Хук для отслеживания действия кнопки назад.
 * Принимает функцию, которая должна вернуть булевое значение, означающее, нужно ли игнорировать нажатие кнопки
 */
const useBackPress = (callback: () => boolean) => {
  const navigation = useNavigation();
  useEffect(() => {
    navigation.addListener('beforeRemove', (event) => {
      const shouldPrevent = callback();
      if (shouldPrevent) {
        event.preventDefault();
      }
    });
    const handler = BackHandler.addEventListener('hardwareBackPress', callback);

    return () => {
      handler.remove();
      // navigation.removeListener()
    };
  }, []);
};

export default useBackPress;
