import React, { useMemo } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { cache } from '../../cache/smartCache';
import ClickableText from '../../components/ClickableText';
import Screen from '../../components/Screen';
import Text from '../../components/Text';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { useAppTheme } from '../../hooks/theme';
import { changeTheme, setEvents } from '../../redux/reducers/settingsSlice';
import { APP_THEMES, ITheme, ThemeType } from '../../styles/themes';
import { fontSize } from '../../utils/texts';

const CircleButton = ({
  title,
  theme,
  onPress,
}: {
  title: string;
  theme: ITheme;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity style={styles.circleButton} onPress={onPress}>
      <View style={styles.circleBorder}>
        <View style={styles.circleContainer}>
          <View
            style={[
              styles.leftCirclePart,
              {
                backgroundColor:
                  theme.colors.background !== 'transparent'
                    ? theme.colors.background
                    : theme.colors.backgroundGradient[0],
              },
            ]}
          />
          <View style={[styles.rightCirclePart, { backgroundColor: theme.colors.block }]} />
          <View style={[styles.topCirclePart, { backgroundColor: theme.colors.primary }]} />
        </View>
      </View>
      <Text>{title}</Text>
    </TouchableOpacity>
  );
};

const NewYearThemes = () => {
  const dispatch = useAppDispatch();
  const theme = useAppTheme();
  const { events, theme: themeType } = useAppSelector((state) => state.settings);
  const preThemeType = useMemo(() => themeType, []);

  const handleThemeChange = async (type: ThemeType) => {
    dispatch(changeTheme(type));
    await cache.placeTheme(type);
  };

  const handleSkip = async () => {
    if (themeType !== preThemeType) {
      await handleThemeChange(preThemeType);
    }
    await handleContinue();
  };

  const handleContinue = async () => {
    const $events = { ...events };
    $events.newYear2024 = {
      suggestedTheme: true,
      previousTheme: preThemeType,
    };
    dispatch(setEvents($events));
    await cache.placeEvents($events);
  };

  return (
    <Screen>
      <View style={styles.textContainer}>
        <Text style={[fontSize.xlarge, { fontWeight: '500' }]}>С новым годом!</Text>
        <Text style={fontSize.large}>
          В преддверии нового года мы предлагаем вам на выбор одну из предоставленных новогодних тем
        </Text>
      </View>
      <View style={styles.circleButtonList}>
        <CircleButton
          title={'Красный'}
          theme={APP_THEMES.newYear}
          onPress={() => handleThemeChange(ThemeType.newYear)}
        />
        <CircleButton
          title={'Синий'}
          theme={APP_THEMES.blueNewYear}
          onPress={() => handleThemeChange(ThemeType.blueNewYear)}
        />
        <CircleButton
          title={'Зелёный'}
          theme={APP_THEMES.greenNewYear}
          onPress={() => handleThemeChange(ThemeType.greenNewYear)}
        />
      </View>
      <View style={{ flexDirection: 'row', marginTop: '2%', justifyContent: 'space-between' }}>
        <ClickableText
          text={'Пропустить'}
          onPress={handleSkip}
          textStyle={fontSize.medium}
          viewStyle={{
            flex: 1,
            padding: '1%',
            borderWidth: 1,
            borderRadius: 10,
            borderColor: theme.colors.text,
            alignItems: 'center',
          }}
        />
        <View style={{ flex: 1 }} />
        <ClickableText
          text={'Далее'}
          onPress={handleContinue}
          textStyle={fontSize.medium}
          viewStyle={{
            flex: 1,
            padding: '1%',
            borderWidth: 1,
            borderRadius: 10,
            borderColor: theme.colors.text,
            alignItems: 'center',
          }}
        />
      </View>
    </Screen>
  );
};

export default NewYearThemes;

const styles = StyleSheet.create({
  textContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  circleButtonList: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  circleButton: { justifyContent: 'center', alignItems: 'center' },
  circleBorder: {
    width: 55,
    height: 55,
    borderRadius: 27,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleContainer: { width: 50, height: 50 },
  topCirclePart: {
    position: 'absolute',
    width: 50,
    height: 25,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  leftCirclePart: {
    position: 'absolute',
    left: 0,
    width: 25,
    height: 50,
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 25,
  },
  rightCirclePart: {
    position: 'absolute',
    right: 0,
    width: 25,
    height: 50,
    borderTopRightRadius: 25,
    borderBottomRightRadius: 25,
  },
});
