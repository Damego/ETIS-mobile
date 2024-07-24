import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import Text from '~/components/Text';
import { useGlobalStyles } from '~/hooks';
import { fontSize } from '~/utils/texts';


const Input = ({ name, placeholder, onUpdate, value, popover }) => {
  const globalStyles = useGlobalStyles();
  return (
    <>
      <Text style={fontSize.big}>{name}</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={[
            fontSize.small,
            globalStyles.textColor,
            globalStyles.border,
            styles.input,
            styles.width85,
          ]}
          placeholderTextColor={globalStyles.inputPlaceholder.color}
          placeholder={placeholder}
          onChangeText={onUpdate}
          value={value}
          selectionColor={globalStyles.primaryBackgroundColor.backgroundColor}
        />
        {popover}
      </View>
    </>
  );
};

export default Input;

const styles = StyleSheet.create({
  popover: {
    borderRadius: 10,
    padding: '2%',
  },
  input: { margin: '3%', paddingHorizontal: '2%' },
  inputRow: { flexDirection: 'row', alignItems: 'center' },
  width85: { width: '85%' },
});
