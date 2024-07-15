import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Screen from '~/components/Screen';
import Text from '~/components/Text';
import { useGlobalStyles } from '~/hooks';
import { EducationNavigationProp, EducationStackParamList } from '~/navigation/types';

const ICON_SIZE = 40;

interface ScreenT {
  title: string;
  icon: (color: string) => React.ReactNode;
  screenName: keyof EducationStackParamList;
}

const SCREENS: ScreenT[][] = [
  [
    {
      title: 'Учебный план',
      icon: (color) => <AntDesign name={'profile'} size={ICON_SIZE} color={color} />,
      screenName: 'TeachPlan',
    },
    {
      title: 'Пропущенные занятия',
      icon: (color) => (
        <Image
          source={require('../../../../../assets/absences.svg')}
          style={{ width: 38, height: 38 }}
          tintColor={color}
        />
      ),
      screenName: 'Absences',
    },
  ],
  [
    {
      title: 'Преподаватели',
      icon: (color) => <AntDesign name={'team'} size={ICON_SIZE} color={color} />,
      screenName: 'Teachers',
    },
    {
      title: 'Рейтинг',
      icon: (color) => <AntDesign name={'staro'} size={ICON_SIZE} color={color} />,
      screenName: 'Rating',
    },
  ],
  [
    {
      title: 'Приказы',
      icon: (color) => <AntDesign name={'filetext1'} size={ICON_SIZE} color={color} />,
      screenName: 'Orders',
    },
    {
      title: 'Справки',
      icon: (color) => <AntDesign name={'book'} size={ICON_SIZE} color={color} />,
      screenName: 'Certificate',
    },
  ],
  [
    {
      title: 'Анкетирование',
      icon: (color) => <AntDesign name={'copy1'} size={ICON_SIZE} color={color} />,
      screenName: 'SessionQuestionnaireList',
    },
  ],
];

const ScreenButton = ({ screen }: { screen: ScreenT }) => {
  const { title, screenName, icon } = screen;

  const globalStyles = useGlobalStyles();
  const navigation = useNavigation<EducationNavigationProp>();

  const handlePress = () => {
    navigation.navigate(screenName);
  };

  return (
    <TouchableOpacity style={[styles.card, globalStyles.card]} onPress={handlePress}>
      {icon(globalStyles.textColor.color)}
      <Text style={styles.cardText}>{title}</Text>
    </TouchableOpacity>
  );
};

const MoreScreens = () => {
  return (
    <Screen containerStyle={{ gap: 8 }}>
      <Text style={styles.titleText}>Меню ЕТИС</Text>

      <View style={{ gap: 10 }}>
        {SCREENS.map((group, index) => (
          <View style={{ flexDirection: 'row', gap: 10 }} key={index}>
            {group.map((screen) => (
              <ScreenButton screen={screen} key={screen.screenName} />
            ))}
          </View>
        ))}
      </View>
    </Screen>
  );
};

export default MoreScreens;

const styles = StyleSheet.create({
  titleText: { fontWeight: '700', fontSize: 22 },
  card: { padding: '4%', flex: 1, gap: 8 },
  cardText: { fontWeight: '600', fontSize: 16 },
});
