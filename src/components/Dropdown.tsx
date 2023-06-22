import { AntDesign } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useGlobalStyles } from '../hooks';
import { fontSize } from '../utils/texts';

const styles = StyleSheet.create({
  dropdownView: {
    position: 'relative',
    flexGrow: 1,
  },
  selectButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: '6%',
    paddingVertical: '3%',
    alignItems: 'center',
  },
  selectText: {
    textAlign: 'center',
    fontWeight: '600',
  },
  menuView: {
    position: 'absolute',
    top: '100%',
    width: '100%',
    elevation: 10,
  },
  optionView: {
    paddingHorizontal: '6%',
    paddingVertical: '3%',
  },
  optionText: {
    fontWeight: '500',
  },
});

const SelectOption = ({ label }) => {
  const globalStyles = useGlobalStyles();

  return (
    <View style={styles.optionView}>
      <Text style={[fontSize.medium, styles.optionText, globalStyles.textColor]}>{label}</Text>
    </View>
  );
};

function Menu({ options, onSelect }) {
  const globalStyles = useGlobalStyles();

  return (
    <View style={[styles.menuView, globalStyles.border, globalStyles.block]}>
      {options.map(({ label, value }) => (
        <TouchableOpacity
          onPress={() => onSelect(value)}
          key={`pressable-${label}`}
          activeOpacity={0.9}
        >
          <SelectOption label={label} key={label} />
        </TouchableOpacity>
      ))}
    </View>
  );
}

function Select({ selectedOption, isOpened, toggleOpened }) {
  const globalStyles = useGlobalStyles();

  return (
    <TouchableOpacity
      style={[styles.selectButton, globalStyles.border, globalStyles.block]}
      onPress={toggleOpened}
      activeOpacity={0.9}
    >
      <Text style={[fontSize.medium, styles.selectText, globalStyles.textColor]}>
        {selectedOption}
      </Text>
      <AntDesign
        name={isOpened ? 'caretup' : 'caretdown'}
        size={14}
        color={globalStyles.textColor.color}
      />
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
      {isOpened && <Menu options={options} onSelect={onSelect} />}
    </View>
  );
}
