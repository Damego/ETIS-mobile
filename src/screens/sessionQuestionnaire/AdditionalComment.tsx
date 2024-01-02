import React from 'react';
import { Text, TextInput, View } from 'react-native';

import { useGlobalStyles } from '../../hooks';
import { fontSize } from '../../utils/texts';

export default function AdditionalComment({ onTextChange }: { onTextChange(text: string): void }) {
  const globalStyles = useGlobalStyles();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={[globalStyles.textColor, fontSize.medium, { marginBottom: '2%' }]}>
        Комментарий о преподавателе в свободной форме (не более 4000 символов)
      </Text>

      <TextInput
        style={[
          globalStyles.fontColorForBlock,
          globalStyles.border,
          globalStyles.block,
          { width: '100%', paddingVertical: '2%', paddingHorizontal: '2%' },
        ]}
        onChangeText={onTextChange}
        placeholder="Топ препод"
        placeholderTextColor={globalStyles.inputPlaceholder.color}
        inputMode="text"
        keyboardType="default"
        selectionColor={globalStyles.primaryFontColor.color}
        autoCapitalize={'sentences'}
        multiline
        maxLength={4000}
      />
    </View>
  );
}
