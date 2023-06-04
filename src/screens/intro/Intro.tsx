import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Dimensions, Image, ListRenderItemInfo, StyleSheet, Text, View } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import { ImageRequireSource } from 'react-native/Libraries/Image/ImageSource';

import { useAppDispatch } from '../../hooks';
import { setIntroViewed } from '../../redux/reducers/settingsSlice';
import { storage } from '../../utils';

const { fontScale } = Dimensions.get('window');

const styles = StyleSheet.create({
  mainContent: {
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: '20%',
  },
  image: {
    marginVertical: '5%',
    width: 220,
    height: 220,
  },
  text: {
    fontFamily: 'Nunito-SemiBold',
    color: '#FFFFFFCC',
    backgroundColor: 'transparent',
    textAlign: 'center',
    fontSize: 15 * fontScale,
    paddingHorizontal: 16,
  },
  title: {
    fontFamily: 'Nunito-Bold',
    fontSize: 20 * fontScale,
    color: 'white',
    backgroundColor: 'transparent',
    textAlign: 'center',
    height: '12%',
  },
});

type SlideItem = ListRenderItemInfo<ISlide> & { dimensions: { width: number; height: number } };
interface ISlide {
  key: string;
  title: string;
  text: string;
  colors: string[];
  source: ImageRequireSource;
}

const slides: ISlide[] = [
  {
    key: 'welcome',
    title: 'Добро пожаловать в ETIS Mobile!',
    text: 'Это как обычный ЕТИС, но лучше!',
    colors: ['#4389A2', '#5C258D'],
    source: require('../../../assets/intro/welcome.png'),
  },
  {
    key: 'offline',
    title: 'Оставайся на связи даже оффлайн!',
    text: 'Даже при отсутствии интернета Вы сможете узнать своё расписание!',
    colors: ['#5C258D', '#832161'],
    source: require('../../../assets/intro/shine.gif'),
  },
  {
    key: 'secure',
    title: 'Мы не передаем ваши данные!',
    text: 'Приложение общается исключительно с серверами ЕТИС ПГНИУ, а все данные хранятся локально',
    colors: ['#832161', '#0096c7'],
    source: require('../../../assets/intro/search.png'),
  },
  {
    key: 'oss',
    title: 'ETIS Mobile открыт всем!',
    text: 'Мы свободно распространяем как приложение, так и его исходный код! Ссылка находится в меню сервисов',
    colors: ['#0096c7', '#9b72cf'],
    source: require('../../../assets/intro/matrix.gif'),
  },
  {
    key: 'lets',
    title: 'Начинай скорее!',
    text: 'Не забудьте поделиться ссылкой, но, помните, приложение не является официальным клиентом',
    colors: ['#9b72cf', '#cc2b5e'],
    source: require('../../../assets/intro/smile.png'),
  },
];

const Intro = () => {
  const dispatch = useAppDispatch();

  const onIntroDone = () => {
    storage.setViewedIntro();
    dispatch(setIntroViewed(true));
  };

  const renderItem = (item: SlideItem) => (
    <LinearGradient
      style={[styles.mainContent, item.dimensions]}
      colors={item.item.colors}
      locations={[0.1, 0.9]}
      start={{ x: 0.0, y: 0.5 }}
      end={{ x: 1, y: 0.65 }}
    >
      <Image style={styles.image} source={item.item.source} />

      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{item.item.title}</Text>
        <Text style={styles.text}>{item.item.text}</Text>
      </View>
    </LinearGradient>
  );

  return (
    <View style={{ flex: 1 }}>
      <AppIntroSlider
        nextLabel={'Дальше'}
        onDone={onIntroDone}
        doneLabel={'Вперёд!'}
        data={slides}
        renderItem={(item) => renderItem(item)}
        bottomButton
      />
    </View>
  );
};
export default Intro;
