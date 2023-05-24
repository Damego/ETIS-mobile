import { AntDesign } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInUp, FadeOutUp, Layout } from 'react-native-reanimated';

import { useGlobalStyles } from '../hooks';

const styles = StyleSheet.create({
  dropdownView: {
    position: 'relative',
  },
  selectButton: {
    backgroundColor: '#FFFFFF',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: '6%',
    paddingVertical: '3%',
    alignItems: 'center',
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
    elevation: 10,
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

const SelectOption = ({ label }) => (
  <View style={styles.optionView}>
    <Text style={styles.optionText}>{label}</Text>
  </View>
);

function Menu({ options, onSelect }) {
  const globalStyles = useGlobalStyles();

  return (
    <Animated.View
      entering={FadeInUp}
      layout={Layout.springify()}
      exiting={FadeOutUp}
      style={[styles.menuView, globalStyles.border]}
    >
      {options.map(({ label, value }) => (
        <TouchableOpacity
          onPress={() => onSelect(value)}
          key={`pressable-${label}`}
          activeOpacity={0.9}
        >
          <SelectOption label={label} key={label} />
        </TouchableOpacity>
      ))}
    </Animated.View>
  );
}

function Select({ selectedOption, isOpened, toggleOpened }) {
  const globalStyles = useGlobalStyles();

  return (
    <TouchableOpacity
      style={[styles.selectButton, globalStyles.border]}
      onPress={toggleOpened}
      activeOpacity={0.9}
    >
      <Text style={styles.selectText}>{selectedOption}</Text>
      <AntDesign name={isOpened ? 'caretup' : 'caretdown'} size={14} color="black" />
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
