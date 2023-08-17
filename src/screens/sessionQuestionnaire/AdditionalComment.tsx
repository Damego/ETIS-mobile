import { TextInput, View, Text } from 'react-native';

import { useGlobalStyles } from '../../hooks';
import { fontSize } from '../../utils/texts';

export default function AdditionalComment({ onTextChange }: { onTextChange(text: string): void }) {
  const globalStyles = useGlobalStyles();

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text style={[fontSize.medium, {marginBottom: '2%'}]}>Комментарий о преподавателе в свободной форме (не более 4000 символов)</Text>

      <TextInput
        style={[
          globalStyles.textColor,
          globalStyles.border,
          globalStyles.block,
          { width: '100%', paddingVertical: '2%', paddingHorizontal: '2%' },
        ]}
        onChangeText={onTextChange}
        placeholder="Топ препод"
        placeholderTextColor={globalStyles.textColor.color}
        inputMode="text"
        keyboardType="default"
        selectionColor="#C62E3E"
        autoCapitalize={'sentences'}
        multiline
        maxLength={4000}
      />
    </View>
  );
}
