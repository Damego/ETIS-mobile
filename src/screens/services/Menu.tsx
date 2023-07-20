import { AntDesign, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useGlobalStyles } from '../../hooks';
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
    justifyContent: 'flex-start',
    marginBottom: '5%',
  },
});

function Button({ icon, text, page, link }: {
  icon: React.ReactNode;
  text: string;
  page?: string;
  link?: string;
}) {
  const navigation = useNavigation();
  const globalStyles = useGlobalStyles();

  const changePage = () => {
    if (page) navigation.navigate(page);
    else if (link) Linking.openURL(link);
  };

  return (
    <TouchableOpacity style={styles.buttonView} onPress={changePage} activeOpacity={0.9}>
      <View style={[styles.buttonContainer, globalStyles.border, globalStyles.block]}>{icon}</View>
      <Text style={[fontSize.mini, globalStyles.textColor]}>{text}</Text>
    </TouchableOpacity>
  );
}

function Row({ children }) {
  return <View style={styles.rowView}>{children}</View>;
}

function Menu() {
  const globalStyles = useGlobalStyles();
  const iconColor = globalStyles.textColor.color;

  return (
    <View>
      <Row>
        <Button
          text="Учебный план"
          icon={<AntDesign name="profile" size={iconSize} color={iconColor} />}
          page="Учебный план"
        />
        <Button
          text="Преподаватели"
          icon={<AntDesign name="team" size={iconSize} color={iconColor} />}
          page="Преподаватели"
        />
        <Button
          text="Приказы"
          icon={<AntDesign name="filetext1" size={iconSize} color={iconColor} />}
          page="Приказы"
        />
      </Row>
      <Row>
        <Button
          text="Исходный код"
          icon={<AntDesign name="github" size={iconSize} color={iconColor} />}
          link={GITHUB_URL}
        />
        <Button
          text="Telegram-паблик"
          link={TELEGRAM_URL}
          icon={<FontAwesome5 name="telegram" size={iconSize} color={iconColor} />}
        />
      </Row>
      <Row>
        <Button
          text="О приложении"
          icon={<AntDesign name="infocirlceo" size={iconSize} color={iconColor} />}
          page="О приложении"
        />
      </Row>
    </View>
  );
}

export default Menu;
