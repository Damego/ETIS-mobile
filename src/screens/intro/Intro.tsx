import PagerView, { type PagerViewRef } from '@expo/ui/community/pager-view';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import { Image, type ImageSource } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Pressable, StyleSheet, Text, View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { cache } from '~/cache/smartCache';
import { useAppDispatch } from '~/hooks';
import { RootStackNavigationProp } from '~/navigation/types';
import { setIntroViewed } from '~/redux/reducers/settingsSlice';
import { fontSize } from '~/utils/texts';

interface ISlide {
  key: string;
  // Градиентная пара v1-интро; интро всегда светлое —
  // цвета фиксированы и не зависят от темы приложения
  colors: [string, string];
  source: ImageSource;
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
    source: require('../../../assets/intro/shine.webp'),
  },
  {
    key: 'secure',
    colors: ['#832161', '#0096c7'],
    source: require('../../../assets/intro/search.png'),
  },
  {
    key: 'oss',
    colors: ['#0096c7', '#9b72cf'],
    source: require('../../../assets/intro/matrix.webp'),
  },
  {
    key: 'lets',
    colors: ['#9b72cf', '#cc2b5e'],
    source: require('../../../assets/intro/smile.png'),
  },
];

// --- Плавный градиент между слайдами ---
// PagerView жёстко режет страницы, поэтому каждый слайд несёт свой градиент —
// на стыке цвета обрываются. Вместо этого градиент рисуется ОДНИМ фоном под
// прозрачным пейджером: onPageScroll даёт дробную позицию свайпа, и фон
// непрерывно интерполируется от цветов текущего слайда к следующему.

const hexToRgb = (hex: string): [number, number, number] => {
  const value = Number.parseInt(hex.replace('#', ''), 16);
  const r = Math.floor(value / 65_536) % 256;
  const g = Math.floor(value / 256) % 256;
  const b = value % 256;
  return [r, g, b];
};

const toHex = (r: number, g: number, b: number): string =>
  [r, g, b]
    .map((channel) => channel.toString(16).padStart(2, '0'))
    .join('');

const lerpColor = (from: string, to: string, t: number): string => {
  const [r1, g1, b1] = hexToRgb(from);
  const [r2, g2, b2] = hexToRgb(to);
  return `#${toHex(
    Math.round(r1 + (r2 - r1) * t),
    Math.round(g1 + (g2 - g1) * t),
    Math.round(b1 + (b2 - b1) * t)
  )}`;
};

const lerpPair = (
  from: readonly [string, string],
  to: readonly [string, string],
  t: number
): [string, string] => [lerpColor(from[0], to[0], t), lerpColor(from[1], to[1], t)];

const BUTTON_RADIUS = 50;
// Диаметр точки-индикатора
const DOT_SIZE = 8;
// Отступ между точками
const DOT_GAP = 8;

// Слайд прозрачный: общий градиент фона лежит под пейджером и
// плавно перетекает между слайдами (см. lerpPair выше)
const Slide = ({ slide, title, text }: { readonly slide: ISlide; readonly title: string; readonly text: string }) => (
  <View style={styles.slide}>
    <Image source={slide.source} style={styles.image} />

    <View style={styles.textContainer}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.text}>{text}</Text>
    </View>
  </View>
);

const Intro = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigation = useNavigation<RootStackNavigationProp>();
  const insets = useSafeAreaInsets();
  const pagerRef = useRef<PagerViewRef | null>(null);
  const [position, setPosition] = useState(0);
  // Дробная позиция свайпа (position + offset) — для интерполяции фона
  const [scrollProgress, setScrollProgress] = useState(0);

  const isLast = position === slides.length - 1;

  // Цвета фона: интерполяция от текущего слайда к следующему по прогрессу
  // свайпа. useMemo — purity: вычисление зависит только от scrollProgress.
  const backgroundColors = React.useMemo(() => {
    const clamped = Math.max(0, Math.min(slides.length - 1, scrollProgress));
    const index = Math.min(Math.floor(clamped), slides.length - 2);
    const from = slides[index];
    const to = slides[index + 1];
    if (!from || !to) return slides[0].colors;
    return lerpPair(from.colors, to.colors, clamped - index);
  }, [scrollProgress]);

  const finish = () => {
    cache.placeIntroViewed(true);
    dispatch(setIntroViewed(true));
    // initialRouteName применяется только при первом монтировании навигатора —
    // диспатча недостаточно, уходим со стека явно
    navigation.reset({ index: 0, routes: [{ name: 'TabNavigator' }] });
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
      {/* Белый текст на градиенте — только светлые иконки статус-бара;
          style — строковый проп expo-status-bar, не RN style */}
      {/* eslint-disable-next-line react/style-prop-object */}
      <StatusBar style='light' />

      {/* Общий плавный фон: интерполируется по мере свайпа,
          направление — как в v1 (160°) */}
      <LinearGradient
        colors={backgroundColors}
        start={{ x: 0, y: 0.2 }}
        end={{ x: 1, y: 0.9 }}
        style={styles.background}
      />

      <PagerView
        ref={pagerRef}
        style={styles.pager}
        onPageSelected={(event) => {
          setPosition(event.nativeEvent.position);
        }}
        onPageScroll={(event) => {
          const { position: leading, offset } = event.nativeEvent;
          setScrollProgress(leading + offset);
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
            disabled={position === 0}
            style={[styles.button, styles.buttonBack, position === 0 && styles.buttonHidden]}
            onPress={back}
          >
            <Text style={styles.buttonBackText}>{t('common.back')}</Text>
          </Pressable>

          <Pressable
            style={[styles.button, styles.buttonNext]}
            accessibilityLabel={isLast ? t('intro.done') : t('intro.next')}
            onPress={next}
          >
            {isLast ? (
              // Высота иконки = lineHeight текста «Далее»: кнопка не меняет
              // размер при смене контента на последнем слайде
              <AntDesign name='arrowright' size={24} color='#FFFFFF' style={styles.buttonNextIcon} />
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
  // Фоновый градиент под прозрачным пейджером — интерполируется на свайпе
  background: {
    ...StyleSheet.absoluteFill,
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
  buttonNextIcon: {
    // fontSize.medium + Ubuntu default line-height ≈ 19–20px —
    // иконка 24px давала другой размер кнопки
    lineHeight: 20,
  },
  buttonHidden: {
    opacity: 0,
  },
});

export default Intro;
