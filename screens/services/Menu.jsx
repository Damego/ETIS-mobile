import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import useGlobalStyles from '../../styles';

const iconSize = 36;
const iconColor = '#000000'
const styles = StyleSheet.create({
  buttonView: {
    alignItems: 'center',
    marginHorizontal: '1%',
    width: 100,
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
    marginBottom: '5%'
  },
});

function Button({ icon, text, page, link }) {
  const globalStyles = useGlobalStyles();
  const navigation = useNavigation();

  const changePage = () => {
    if (page) navigation.navigate(page);
    else if (link) Linking.openURL(link)
  };

  return (
    <TouchableOpacity style={styles.buttonView} onPress={changePage} activeOpacity={0.9}>
      <View style={[styles.buttonContainer, globalStyles.shadow]}>{icon}</View>
      <Text style={styles.buttonText}>{text}</Text>
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