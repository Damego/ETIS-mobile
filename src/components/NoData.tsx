import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Text, View } from 'react-native';

import { useGlobalStyles } from '~/hooks';
import useOfflineMode from '~/hooks/useOfflineMode';
import { fontSize } from '~/utils/texts';

export default function NoData({ text, onRefresh }: { text?: string; onRefresh?: () => void }) {
  const { t } = useTranslation();
  const globalStyles = useGlobalStyles();
  const isOfflineMode = useOfflineMode();

  const $text = text || t('common.noData');
  // В оффлайн-режиме «Повторить» бессмысленна — запрос уйдёт в кеш и вернёт то же самое
  const showRetry = onRefresh !== undefined && !isOfflineMode;

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={[globalStyles.textColor, fontSize.large, { textAlign: 'center' }]}>{$text}</Text>
      {showRetry && (
        <Button title={t('common.retry')} onPress={onRefresh} color={globalStyles.primaryText.color} />
      )}
    </View>
  );
}
