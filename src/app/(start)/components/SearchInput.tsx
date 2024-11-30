import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { useGlobalStyles } from '~/hooks';

const SearchInput = ({
  value,
  onValueChange,
  autoCapitalize,
}: {
  value: string;
  onValueChange: (value: string) => void;
  autoCapitalize?: boolean;
}) => {
  const globalStyles = useGlobalStyles();

  return (
    <View style={[styles.container, globalStyles.card]}>
      <AntDesign name={'search1'} size={20} color={globalStyles.textColor.color} />
      <TextInput
        autoCapitalize={autoCapitalize ? 'characters' : undefined}
        placeholder={'Поиск'}
        style={[styles.input, globalStyles.textColor]}
        value={value}
        onChangeText={onValueChange}
        placeholderTextColor={globalStyles.textColor2.color}
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
