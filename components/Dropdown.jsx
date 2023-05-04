import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

import { GLOBAL_STYLES } from '../styles/styles';

const styles = StyleSheet.create({
  dropdownView: {
    position: "relative"
  },
  selectButton: {
    paddingVertical: '1%',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    display: "flex",
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: '3%',
  },
  selectText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  menuView: {
    position: 'absolute',
  },
  optionView: {
  }
});

function Menu() {
  return (
    <View style={styles.menuView}>
      <View styles={styles.optionView}>
        <Text>Option 1</Text>
      </View>
    </View>
  );
}

function Select({isOpened, toggleOpened}) {
  return (
    <Pressable onPress={toggleOpened}>
      <View style={[styles.selectButton, GLOBAL_STYLES.shadow]}>
        <Text style={styles.selectText}>2 Триместр</Text>
        <AntDesign name={isOpened ? 'caretup' : 'caretdown'} size={14} color="black" />
      </View>
    </Pressable>
  )
}

export default function Dropdown() {
  const [isOpened, setOpened] = useState(false);

  const toggleOpened = () => {
    setOpened(!isOpened);
  };

  return (
    <View style={styles.dropdownView}>
      <Select isOpened={isOpened} toggleOpened={toggleOpened}/>
      {isOpened ? <Menu /> : ''}
    </View>
  );
}
