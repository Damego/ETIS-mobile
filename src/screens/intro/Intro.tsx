import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Image, ListRenderItemInfo, StyleSheet, Text, View } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import { ImageRequireSource } from 'react-native/Libraries/Image/ImageSource';

import { cache } from '../../cache/smartCache';
import { useAppDispatch } from '../../hooks';
import { setIntroViewed } from '../../redux/reducers/settingsSlice';
import { fontSize } from '../../utils/texts';

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
    ...fontSize.small,
    fontFamily: 'Nunito-SemiBold',
    color: '#FFFFFFCC',
    backgroundColor: 'transparent',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  title: {
    fontFamily: 'Nunito-Bold',
    ...fontSize.large,
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
    title: 'Добро пожаловать в ЕТИС мобайл',
    text: 'Лучшая версия ЕТИСа на вашем устройстве!',
    colors: ['#4389A2', '#5C258D'],
    source: require('../../../assets/intro/welcome.png'),
  },
  {
    key: 'offline',
    title: 'Оффлайн режим',
    text: 'Нет интернета? Упал ЕТИС? Ты сможешь смотреть расписание и оценки благодаря оффлайн режиму!',
    colors: ['#5C258D', '#832161'],
    source: require('../../../assets/intro/shine.gif'),
  },
  {
    key: 'secure',
    title: 'Ваши данные в безопасности',
    text: 'Приложение работает только с сайтом ЕТИСа, а все ваши данные обрабатываются и хранятся исключительно на вашем устройстве!',
    colors: ['#832161', '#0096c7'],
    source: require('../../../assets/intro/search.png'),
  },
  {
    key: 'oss',
    title: 'Открытый исходный код',
    text: 'Мы свободно распространяем как приложение, так и его исходный код! Любой желающий может его изучить и даже помочь нам с разработкой :)',
    colors: ['#0096c7', '#9b72cf'],
    source: require('../../../assets/intro/matrix.gif'),
  },
  {
    key: 'lets',
    title: 'Начинай скорее!',
    text: 'Не забудьте поделиться ссылкой с одногрупниками!',
    colors: ['#9b72cf', '#cc2b5e'],
    source: require('../../../assets/intro/smile.png'),
  },
];

const Intro = () => {
  const dispatch = useAppDispatch();

  const onIntroDone = () => {
    cache.placeIntroViewed(true);
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
      <StatusBar translucent />

      <AppIntroSlider
        nextLabel={'Дальше'}
        onDone={onIntroDone}
        doneLabel={'Вперёд!'}
        data={slides}
        renderItem={(item: SlideItem) => renderItem(item)}
        bottomButton
      />
    </View>
  );
};
export default Intro;
