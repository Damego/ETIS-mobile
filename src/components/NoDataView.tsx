import { Text, View } from 'react-native';

import { useGlobalStyles } from '../hooks';
import { fontSize } from '../utils/texts';
import ClickableText from './ClickableText';

export default function NoDataView({ text, onRefresh }: { text: string; onRefresh(): void }) {
  const globalStyles = useGlobalStyles();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={[globalStyles.textColor, fontSize.large]}>{text}</Text>

      <ClickableText text="Попробовать снова" onPress={onRefresh} />
    </View>
  );
}
