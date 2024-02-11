import { Ionicons } from '@expo/vector-icons';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { useGlobalStyles } from '../../../hooks';

const AddButton = ({onPress}: {onPress: () => void}) => {
  const globalStyles = useGlobalStyles();
  return (
    <TouchableOpacity
      style={[
        globalStyles.border,
        styles.container
      ]}
      onPress={onPress}
    >
      <Ionicons name={'add'} size={20} />
      <Text>Добавить</Text>
    </TouchableOpacity>
  )
}

export default AddButton;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: '1%',
    paddingHorizontal: '2%',
    alignSelf: 'flex-start',
    borderRadius: 25,
  }
});