import { AntDesign } from '@expo/vector-icons';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import Popover, { PopoverPlacement } from 'react-native-popover-view';

import Text from '~/components/Text';
import { useGlobalStyles } from '~/hooks';
import { useAppTheme } from '~/hooks/theme';
import { fontSize } from '~/utils/texts';

const styles = StyleSheet.create({
  popover: {
    borderRadius: 10,
    padding: '2%',
  },
  input: { margin: '3%', paddingHorizontal: '2%' },
  inputRow: { flexDirection: 'row', alignItems: 'center' },
  width85: { width: '85%' },
});

export const PopoverElement = ({ text }) => {
  const appTheme = useAppTheme();
  return (
    <Popover
      placement={PopoverPlacement.FLOATING}
      from={(_, showPopover) => (
        <TouchableOpacity onPress={showPopover}>
          <AntDesign name="infocirlceo" size={24} color={appTheme.colors.textForBlock} />
        </TouchableOpacity>
      )}
      popoverStyle={[styles.popover, { backgroundColor: appTheme.colors.block }]}
    >
      <Text style={fontSize.medium} colorVariant={'block'}>
        {text}
      </Text>
    </Popover>
  );
};

export const Input = ({ name, placeholder, onUpdate, value, popover }) => {
  const globalStyles = useGlobalStyles();
  return (
    <>
      <Text style={fontSize.medium} colorVariant={'block'}>
        {name}
      </Text>
      <View style={styles.inputRow}>
        <TextInput
          style={[
            fontSize.small,
            globalStyles.fontColorForBlock,
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
