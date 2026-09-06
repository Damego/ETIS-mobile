import PagerView, { type PagerViewRef } from '@expo/ui/community/pager-view';
import AntDesign from '@expo/vector-icons/AntDesign';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Image,
  ImageRequireSource,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { cache } from '~/cache/smartCache';
import { useAppDispatch } from '~/hooks';
import { setIntroViewed } from '~/redux/reducers/settingsSlice';
import { fontSize } from '~/utils/texts';

interface ISlide {
  key: string;
  // Градиентная пара v1-интро; интро всегда светлое —
  // цвета фиксированы и не зависят от темы приложения
  colors: [string, string];
  source: ImageRequireSource;
}

const slides: ISlide[] = [
  {
    key: 'welcome',
    colors: ['#4389A2', '#5C258D'],
    source: require('../../../assets/intro/welcome.png'),
  },
  {
    key: 'offline',
    colors: ['#5C258D', '#832161'],
    source: require('../../../assets/intro/shine.gif'),
  },
  {
    key: 'secure',
    colors: ['#832161', '#0096c7'],
    source: require('../../../assets/intro/search.png'),
  },
  {
    key: 'oss',
    colors: ['#0096c7', '#9b72cf'],
    source: require('../../../assets/intro/matrix.gif'),
  },
  {
    key: 'lets',
    colors: ['#9b72cf', '#cc2b5e'],
    source: require('../../../assets/intro/smile.png'),
  },
];

const BUTTON_RADIUS = 50;
// Диаметр точки-индикатора
const DOT_SIZE = 8;
// Отступ между точками
const DOT_GAP = 8;

const Slide = ({ slide, title, text }: { slide: ISlide; title: string; text: string }) => (
  <LinearGradient
    colors={slide.colors}
    // Направление из варианта «в градиент» (160°): слева-сверху вправо-вниз
    start={{ x: 0, y: 0.2 }}
    end={{ x: 1, y: 0.9 }}
    style={styles.slide}
  >
    <Image source={slide.source} style={styles.image} />

    <View style={styles.textContainer}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.text}>{text}</Text>
    </View>
  </LinearGradient>
);

const Intro = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const pagerRef = useRef<PagerViewRef | null>(null);
  const [position, setPosition] = useState(0);

  const isLast = position === slides.length - 1;

  const finish = () => {
    cache.placeIntroViewed(true);
    dispatch(setIntroViewed(true));
  };

  const next = () => {
    if (isLast) {
      finish();
      return;
    }

    pagerRef.current?.setPage(position + 1);
  };

  const back = () => {
    pagerRef.current?.setPageWithoutAnimation(position - 1);
  };

  return (
    <View style={styles.container}>
      {/* Белый текст на градиенте — только светлые иконки статус-бара */}
      <StatusBar style='light' />

      <PagerView
        ref={pagerRef}
        style={styles.pager}
        onPageSelected={(event) => {
          setPosition(event.nativeEvent.position);
        }}
      >
        {slides.map((slide) => (
          <Slide
            key={slide.key}
            slide={slide}
            title={t(`intro.${slide.key}.title`)}
            text={t(`intro.${slide.key}.text`)}
          />
        ))}
      </PagerView>

      <View
        style={[
          styles.footer,
          {
            paddingBottom: Math.max(insets.bottom, 16),
            paddingHorizontal: 16,
          },
        ]}
      >
        <View style={styles.dots}>
          {slides.map((slide, index) => (
            <View
              key={slide.key}
              style={[styles.dot, index === position && styles.dotActive]}
            />
          ))}
        </View>

        <View style={styles.buttons}>
          <Pressable
            onPress={back}
            disabled={position === 0}
            style={[styles.button, styles.buttonBack, position === 0 && styles.buttonHidden]}
          >
            <Text style={styles.buttonBackText}>{t('common.back')}</Text>
          </Pressable>

          <Pressable
            onPress={next}
            style={[styles.button, styles.buttonNext]}
            accessibilityLabel={isLast ? t('intro.done') : t('intro.next')}
          >
            {isLast ? (
              <AntDesign name='arrowright' size={24} color='#FFFFFF' />
            ) : (
              <Text style={styles.buttonNextText}>{t('intro.next')}</Text>
            )}
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pager: {
    flex: 1,
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    // Футер с кнопками наложен поверх пейджера —
    // резервируем место, чтобы текст не ушёл под него
    paddingBottom: 120,
  },
  image: {
    width: 220,
    height: 220,
    marginVertical: '5%',
  },
  textContainer: {
    alignItems: 'center',
    gap: 12,
  },
  title: {
    ...fontSize.xlarge,
    fontFamily: 'Ubuntu-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  text: {
    ...fontSize.small,
    fontFamily: 'Ubuntu-Regular',
    color: '#FFFFFFCC',
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    gap: 16,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: DOT_GAP,
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: '#FFFFFF55',
  },
  dotActive: {
    backgroundColor: '#FFFFFF',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: BUTTON_RADIUS,
  },
  buttonBack: {
    backgroundColor: '#FFFFFF1A',
  },
  buttonBackText: {
    ...fontSize.medium,
    fontFamily: 'Ubuntu-Medium',
    color: '#FFFFFF',
  },
  buttonNext: {
    backgroundColor: '#FFFFFF26',
  },
  buttonNextText: {
    ...fontSize.medium,
    fontFamily: 'Ubuntu-Bold',
    color: '#FFFFFF',
  },
  buttonHidden: {
    opacity: 0,
  },
});

export default Intro;
