import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';

const useBackPress = (callback: () => boolean) => {
  const navigation = useNavigation();
  useEffect(() => {
    navigation.addListener('beforeRemove', (event) => {
      const shouldPrevent = callback();
      if (shouldPrevent) {
        event.preventDefault();
      }
    });
  }, []);
};

export default useBackPress;
