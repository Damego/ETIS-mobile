import { AntDesign, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useAppSelector, useGlobalStyles } from '../../hooks';
import { ServicesNativeStackParamList, ServicesNavigationProp } from '../../navigation/types';
import { GITHUB_URL, TELEGRAM_URL } from '../../utils';
import { fontSize } from '../../utils/texts';

const iconSize = 36;
const styles = StyleSheet.create({
  buttonView: {
    alignItems: 'center',
    marginHorizontal: '1%',
    width: 100,
  },
  buttonContainer: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowView: {
    marginVertical: '1%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  menuContainer: {
    gap: 8,
  },
});

function Button({
  icon,
  text,
  page,
  link,
}: {
  icon: React.ReactNode;
  text: string;
  page?: keyof ServicesNativeStackParamList;
  link?: string;
}) {
  const navigation = useNavigation<ServicesNavigationProp>();
  const globalStyles = useGlobalStyles();

  const changePage = () => {
    if (page) navigation.navigate(page);
    else if (link) Linking.openURL(link);
  };

  return (
    <TouchableOpacity style={styles.buttonView} onPress={changePage} activeOpacity={0.9}>
      <View style={[styles.buttonContainer, globalStyles.border, globalStyles.block]}>{icon}</View>
      <Text style={[fontSize.mini, globalStyles.textColor, { textAlign: 'center' }]}>{text}</Text>
    </TouchableOpacity>
  );
}

// Для того чтобы были одинаковые отступы
function InvisibleButton() {
  return (
    <View style={styles.buttonView}>
      <View style={styles.buttonView} />
    </View>
  );
}

function Row({ children }) {
  return <View style={styles.rowView}>{children}</View>;
}

function Menu() {
  const globalStyles = useGlobalStyles();
  const { sessionTestID } = useAppSelector((state) => state.student);
  const isDemo = useAppSelector((state) => state.auth.isDemo);
  const iconColor = globalStyles.textColor.color;

  return (
    <View style={styles.menuContainer}>
      <Row>
        <Button
          text="Учебный план"
          icon={<AntDesign name="profile" size={iconSize} color={iconColor} />}
          page="TeachPlan"
        />
        <Button
          text="Преподаватели"
          icon={<AntDesign name="team" size={iconSize} color={iconColor} />}
          page="Teachers"
        />
        <Button
          text="Приказы"
          icon={<AntDesign name="filetext1" size={iconSize} color={iconColor} />}
          page="Orders"
        />
      </Row>
      <Row>
        {(sessionTestID || isDemo) && (
          <Button
            icon={<AntDesign name="copy1" size={iconSize} color={iconColor} />}
            text="Анкетирование"
            page="SessionQuestionnaireList"
          />
        )}
        <Button
          text="Справки"
          icon={<AntDesign name="book" size={iconSize} color={iconColor} />}
          page="Certificate"
        />
        <Button
          text="Пропущенные занятия"
          icon={<AntDesign name={'paperclip'} size={iconSize} color={iconColor} />}
          page="Absences"
        />
      </Row>
      <Row>
        <Button
          text="Исходный код"
          icon={<AntDesign name="github" size={iconSize} color={iconColor} />}
          link={GITHUB_URL}
        />
        <Button
          text="Telegram канал"
          link={TELEGRAM_URL}
          icon={<FontAwesome5 name="telegram" size={iconSize} color={iconColor} />}
        />

        {/* Удалить, если собрались добавлять новую кнопку */}
        <InvisibleButton />
      </Row>
    </View>
  );
}

export default Menu;
