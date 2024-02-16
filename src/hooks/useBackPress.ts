import { useFocusEffect } from '@react-navigation/native';
import { BackHandler } from 'react-native';

const useBackPress = (callback: () => boolean) => {
  useFocusEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', callback);
    return () => sub.remove();
  });
};
export default useBackPress;
