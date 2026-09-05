import { Ionicons } from '@expo/vector-icons';
import { useNetworkState } from 'expo-network';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import Text from '~/components/Text';
import { useAppSelector } from '~/hooks';
import { useAppTheme } from '~/hooks/theme';
import { borderRadius, fontSize, iconSize } from '~/utils/texts';

const OfflineBanner = () => {
  const theme = useAppTheme();
  const isOfflineMode = useAppSelector((state) => state.account.isOfflineMode);
  // До первой проверки сети значение undefined — не показываем баннер,
  // чтобы не мигал на старте
  const { isInternetReachable } = useNetworkState();

  const noConnection = isInternetReachable === false;
  if (!isOfflineMode && !noConnection) return null;

  const message = isOfflineMode
    ? 'Оффлайн-режим — данные из кеша'
    : 'Нет интернет-соединения';

  return (
    <View style={styles.container}>
      <View style={[styles.banner, { backgroundColor: theme.colors.cards }]}>
        <Ionicons
          name={'cloud-offline-outline'}
          size={iconSize.small}
          color={theme.colors.primary}
        />
        <Text style={fontSize.small}>{message}</Text>
      </View>
    </View>
  );
};

export default OfflineBanner;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: '4%',
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 8,
    borderRadius: borderRadius.medium,
    marginBottom: 8,
  },
});
