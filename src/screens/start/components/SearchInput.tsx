import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { useGlobalStyles } from '~/hooks';

const SearchInput = ({
  value,
  onValueChange,
}: {
  value: string;
  onValueChange: (value: string) => void;
}) => {
  const globalStyles = useGlobalStyles();

  return (
    <View style={[styles.container, globalStyles.card]}>
      <AntDesign name={'search1'} size={20} />
      <TextInput
        placeholder={'Поиск'}
        style={styles.input}
        value={value}
        onChangeText={onValueChange}
      />
    </View>
  );
};

export default React.memo(SearchInput);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '2%',
    paddingVertical: '2%',
    gap: 16,
  },
  input: {
    width: '100%',
  },
});
