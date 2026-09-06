import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { useGlobalStyles } from '~/hooks';
import { fontSize } from '~/utils/texts';

function ResultView({ textKey }: { readonly textKey: string }) {
  const { t } = useTranslation();
  const globalStyles = useGlobalStyles();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={[fontSize.large, globalStyles.textColor]}>{t(textKey)}</Text>
    </View>
  );
}

export function ConfirmResultView() {
  return <ResultView textKey='questionnaire.confirmResult' />;
}

export function SendingResultView() {
  return <ResultView textKey='questionnaire.sendingResults' />;
}

export function ResultSentView() {
  return <ResultView textKey='questionnaire.resultSent' />;
}
