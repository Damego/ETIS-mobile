import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TextInput, View } from 'react-native';

import { useGlobalStyles } from '~/hooks';
import { fontSize } from '~/utils/texts';

export default function AdditionalComment({ onTextChange }: { onTextChange(text: string): void }) {
  const { t } = useTranslation();
  const globalStyles = useGlobalStyles();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={[globalStyles.textColor, fontSize.medium, { marginBottom: '2%' }]}>
        {t('questionnaire.commentHint')}
      </Text>

      <TextInput
        style={[
          globalStyles.textColor,
          globalStyles.border,
          { width: '100%', paddingVertical: '2%', paddingHorizontal: '2%' },
        ]}
        onChangeText={onTextChange}
        placeholder={t('questionnaire.commentPlaceholder')}
        placeholderTextColor={globalStyles.inputPlaceholder.color}
        inputMode='text'
        keyboardType='default'
        selectionColor={globalStyles.primaryText.color}
        autoCapitalize={'sentences'}
        multiline
        maxLength={4000}
      />
    </View>
  );
}
