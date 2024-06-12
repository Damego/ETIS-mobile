import React from 'react';
import { Button, Text, View } from 'react-native';
import { useGlobalStyles } from '~/hooks';
import { fontSize } from '~/utils/texts';

export default function NoData({ text, onRefresh }: { text?: string; onRefresh?: () => void }) {
  const globalStyles = useGlobalStyles();

  const $text = text || 'Нет данных для отображения';

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={[globalStyles.textColor, fontSize.large, { textAlign: 'center' }]}>{$text}</Text>
      {onRefresh && (
        <Button title="Повторить" onPress={onRefresh} color={globalStyles.primaryFontColor.color} />
      )}
    </View>
  );
}
