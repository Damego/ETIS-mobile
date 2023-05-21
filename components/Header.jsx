import { AntDesign } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: '5%',
    marginVertical: '2%',
  },
  headerText: {
    fontSize: 26,
    fontWeight: '700',
    marginLeft: '5%',
  },
});

const Header = ({ text, onBackButtonClick }) => {
  const {
    colors: { primary },
  } = useTheme();

  return (
    <View style={styles.headerContainer}>
      {onBackButtonClick ? (
        <TouchableOpacity onPress={onBackButtonClick}>
          <AntDesign name="arrowleft" size={24} color={primary} />
        </TouchableOpacity>
      ) : (
        ''
      )}
      <Text style={[styles.headerText, {color: primary}]}>{text}</Text>
    </View>
  );
};

export default Header;
