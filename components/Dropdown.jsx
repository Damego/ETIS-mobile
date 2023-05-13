import { AntDesign } from '@expo/vector-icons';
import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';

import { GLOBAL_STYLES } from '../styles/styles';

const styles = StyleSheet.create({
  dropdownView: {
    position: 'relative',
  },
  selectButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: '6%',
    paddingVertical: "3%",
    alignItems: "center"
  },
  selectText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  menuView: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    top: '90%',
    width: '100%',
    borderRadius: 10,
  },
  optionView: {
    paddingHorizontal: '6%',
    paddingVertical: '3%',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

function SelectOption({ label }) {
  return (
    <View style={styles.optionView}>
      <Text style={styles.optionText}>{label}</Text>
    </View>
  );
}

function Menu({ options, onSelect }) {

  return (
    <View style={[styles.menuView, GLOBAL_STYLES.shadow]}>
      {options.map(({ label, value }) => (
        <TouchableOpacity onPress={() => onSelect(value)} key={`pressable-${label}`} activeOpacity={0.9}>
          <SelectOption label={label} key={label} />
        </TouchableOpacity>
      ))}
    </View>
  );
}

function Select({ selectedOption, isOpened, toggleOpened }) {
  return (
    <TouchableOpacity onPress={toggleOpened} activeOpacity={0.9}>
      <View style={[styles.selectButton, GLOBAL_STYLES.shadow]}>
        <Text style={styles.selectText}>{selectedOption}</Text>
        <AntDesign name={isOpened ? 'caretup' : 'caretdown'} size={14} color="black" />
      </View>
    </TouchableOpacity>
  );
}

export default function Dropdown({ selectedOption, options, onSelect }) {
  const [isOpened, setOpened] = useState(false);

  const toggleOpened = () => {
    setOpened(!isOpened);
  };

  return (
    <View style={styles.dropdownView}>
      <Select
        selectedOption={selectedOption.label}
        isOpened={isOpened}
        toggleOpened={toggleOpened}
      />
      {isOpened ? <Menu options={options} onSelect={onSelect} /> : ''}
    </View>
  );
}