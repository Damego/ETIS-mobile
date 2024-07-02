import { AntDesign } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useGlobalStyles } from '~/hooks';
import { fontSize } from '~/utils/texts';

import Text from './Text';

interface IDropdownOption {
  label: string;
  value: unknown;
  current: boolean;
}

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
    width: '100%',
    elevation: 10,
  },
  optionView: {
    paddingHorizontal: '6%',
    paddingVertical: '3%',
  },
  optionText: {
    fontWeight: '500',
    ...fontSize.medium,
  },
});

const SelectOption = ({
  option,
  onSelect,
}: {
  option: IDropdownOption;
  onSelect: (value: unknown) => void;
}) => {
  return (
    <TouchableOpacity
      onPress={() => onSelect(option.value)}
      key={`pressable-${option.label}`}
      activeOpacity={0.7}
      disabled={option.current}
      style={styles.optionView}
    >
      <Text style={styles.optionText} colorVariant={option.current ? 'primary' : 'text2'}>
        {option.label}
      </Text>
    </TouchableOpacity>
  );
};

function Menu({
  options,
  onSelect,
}: {
  options: IDropdownOption[];
  onSelect: (value: unknown) => void;
}) {
  const globalStyles = useGlobalStyles();

  return (
    <View>
      <View style={[styles.menuView]}>
        {options.map((option) => (
          <SelectOption option={option} onSelect={onSelect} key={option.label} />
        ))}
      </View>
    </View>
  );
}

function Select({
  selectedOption,
  isOpened,
  toggleOpened,
}: {
  selectedOption: string;
  isOpened: boolean;
  toggleOpened: () => void;
}) {
  const globalStyles = useGlobalStyles();

  return (
    <TouchableOpacity
      style={[styles.selectButton, globalStyles.border]}
      onPress={toggleOpened}
      activeOpacity={0.9}
    >
      <Text style={[fontSize.medium, styles.selectText]}>{selectedOption}</Text>
      <AntDesign
        name={isOpened ? 'caretup' : 'caretdown'}
        size={14}
        color={globalStyles.textColor2.color}
      />
    </TouchableOpacity>
  );
}

export default function Dropdown({
  selectedOption,
  options,
  onSelect,
}: {
  selectedOption: IDropdownOption;
  options: IDropdownOption[];
  onSelect: (value: unknown) => void;
}) {
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
