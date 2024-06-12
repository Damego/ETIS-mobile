import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Text from '~/components/Text';
import { useGlobalStyles } from '~/hooks';

const AddButton = ({ onPress }: { onPress: () => void }) => {
  const globalStyles = useGlobalStyles();
  return (
    <TouchableOpacity style={[globalStyles.border, styles.container]} onPress={onPress}>
      <Ionicons name={'add'} size={20} color={globalStyles.fontColorForBlock.color} />
      <Text>Добавить</Text>
    </TouchableOpacity>
  );
};

export default AddButton;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: '1%',
    paddingHorizontal: '2%',
    alignSelf: 'flex-start',
    borderRadius: 25,
  },
});
