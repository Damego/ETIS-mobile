import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Text from '~/components/Text';
import { useAppSelector } from '~/hooks';
import { useAppTheme } from '~/hooks/theme';
import { ETISNavigationProp, ETISStackParamList } from '~/navigation/types';

const Icon = ({
  iconName,
  title,
  screenName,
  count,
}: {
  iconName: keyof typeof AntDesign.glyphMap;
  title: string;
  screenName: keyof ETISStackParamList;
  count?: number;
}) => {
  const navigation = useNavigation<ETISNavigationProp>();
  const theme = useAppTheme();

  const handleClick = () => {
    navigation.navigate(screenName);
  };

  return (
    <TouchableOpacity onPress={handleClick} style={{ alignItems: 'center' }}>
      <AntDesign name={iconName} size={24} />
      <Text style={{ fontSize: 10, fontWeight: '500' }}>{title}</Text>

      {count && (
        <View
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            width: 15,
            height: 15,
            borderRadius: 8,
            backgroundColor: theme.colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: theme.colors.textForPrimary, fontSize: 10, fontWeight: '500' }}>
            {count}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const Shortcuts = () => {
  const { messageCount, announceCount } = useAppSelector((state) => state.student);

  return (
    <View style={styles.shortcutsContainer}>
      <Icon iconName={'barschart'} title={'Успеваемость'} screenName={'SignsNavigator'} />
      <Icon
        iconName={'message1'}
        title={'Сообщения'}
        screenName={'Messages'}
        count={messageCount}
      />
      <Icon
        iconName={'notification'}
        title={'Объявления'}
        screenName={'Announces'}
        count={announceCount}
      />
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
