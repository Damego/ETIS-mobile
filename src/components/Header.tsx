import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useGlobalStyles } from '../hooks';
import { fontSize } from '../utils/texts';

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: '2%',
  },
  headerText: {
    fontWeight: '700',
    marginLeft: '5%',
  },
  titleContainer: {
    width: '100%',
    textAlign: 'center',
    textAlignVertical: 'center',
    paddingHorizontal: '5%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

const Header = ({ text, onBackButtonClick, titleComponent }: {
  text: string;
  onBackButtonClick?(): void;
  titleComponent?: React.ReactNode;
}) => {
  const globalStyles = useGlobalStyles();

  return (
    <View style={styles.headerContainer}>
      {onBackButtonClick ? (
        <TouchableOpacity onPress={onBackButtonClick}>
          <AntDesign name="arrowleft" size={24} style={globalStyles.primaryFontColor} />
        </TouchableOpacity>
      ) : (
        <></>
      )}
      <View style={styles.titleContainer}>
        <Text style={[fontSize.xlarge, styles.headerText, globalStyles.primaryFontColor]}>
          {text}
        </Text>
        {titleComponent}
      </View>
    </View>
  );
};

export default Header;
