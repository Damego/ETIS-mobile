import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useGlobalStyles } from '../hooks';
import { fontSize } from '../utils/texts';

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: '5%',
    marginVertical: '2%',
  },
  headerText: {
    fontWeight: '700',
    marginLeft: '5%',
  },
});

const Header = ({ text, onBackButtonClick }) => {
  const globalStyles = useGlobalStyles();

  return (
    <View style={styles.headerContainer}>
      {onBackButtonClick ? (
        <TouchableOpacity onPress={onBackButtonClick}>
          <AntDesign name="arrowleft" size={24} style={globalStyles.primaryFontColor} />
        </TouchableOpacity>
      ) : (
        ''
      )}
      <Text style={[fontSize.xlarge, styles.headerText, globalStyles.primaryFontColor]}>
        {text}
      </Text>
    </View>
  );
};

export default Header;
