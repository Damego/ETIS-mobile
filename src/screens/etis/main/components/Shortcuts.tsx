import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Text from '~/components/Text';
import { ETISNavigationProp, ETISStackParamList } from '~/navigation/types';

const Icon = ({
  iconName,
  title,
  screenName,
}: {
  iconName: keyof typeof AntDesign.glyphMap;
  title: string;
  screenName: keyof ETISStackParamList;
}) => {
  const navigation = useNavigation<ETISNavigationProp>();

  const handleClick = () => {
    navigation.navigate(screenName);
  };

  return (
    <TouchableOpacity onPress={handleClick} style={{ alignItems: 'center' }}>
      <AntDesign name={iconName} size={24} />
      <Text style={{ fontSize: 10, fontWeight: '500' }}>{title}</Text>
    </TouchableOpacity>
  );
};

const Shortcuts = () => {
  return (
    <View style={styles.shortcutsContainer}>
      <Icon iconName={'barschart'} title={'Успеваемость'} screenName={'SignsNavigator'} />
      <Icon iconName={'message1'} title={'Сообщения'} screenName={'Messages'} />
      <Icon iconName={'notification'} title={'Объявления'} screenName={'Announces'} />
      <Icon iconName={'appstore-o'} title={'Больше'} screenName={'MoreScreens'} />
    </View>
  );
};

export default Shortcuts;

const styles = StyleSheet.create({
  shortcutsContainer: {
    position: 'absolute',
    backgroundColor: '#FFF',
    flexDirection: 'row',
    width: '85%',
    justifyContent: 'space-between',
    padding: '4%',
    borderRadius: 10,
    top: '74%',
    alignSelf: 'center',

    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 18,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20.0,
    elevation: 24,
  },
});
