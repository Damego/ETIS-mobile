import React from 'react';
import { Text, View } from 'react-native';

import { useGlobalStyles } from '../../hooks';
import { fontSize } from '../../utils/texts';

function ResultView({ text }: { text: string }) {
  const globalStyles = useGlobalStyles();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={[fontSize.large, globalStyles.textColor]}>{text}</Text>
    </View>
  );
}

export function ConfirmResultView() {
  return (
    <ResultView text="Удостоверьтесь в корректности данных и начните анкетирование заново, если желаете" />
  );
}

export function SendingResultView() {
  return <ResultView text="Отправка результатов..." />;
}

export function ResultSentView() {
  return <ResultView text="Успешно отправлено!" />;
}
