import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { GLOBAL_STYLES } from '../../styles/styles';

const iconSize = 36;
const iconColor = '#000000'
const styles = StyleSheet.create({
  buttonView: {
    alignItems: 'center',
    marginHorizontal: '1%',
    width: 100,
    height: 80,
  },
  buttonContainer: {
    backgroundColor: '#FFFFFF',
    width: 50,
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 12
  },
  rowView: {
    marginVertical: "1%",
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
});

function Button({ icon, text, page, link }) {
  const navigation = useNavigation();

  const changePage = () => {
    if (page) navigation.navigate(page);
    else if (link) Linking.openURL(link)
  };

  return (
    <TouchableOpacity onPress={changePage} activeOpacity={0.9}>
      <View style={styles.buttonView}>
        <View style={[styles.buttonContainer, GLOBAL_STYLES.shadow]}>{icon}</View>
        <Text style={styles.buttonText}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
}

function Row({ children }) {
  return <View style={styles.rowView}>{children}</View>;
}

function Menu() {
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
      </Row>
      <Row>
        <Button
          text="Исходный код"
          icon={<AntDesign name="github" size={iconSize} color={iconColor} />}
          link="https://github.com/damego/ETIS-mobile"
        />
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