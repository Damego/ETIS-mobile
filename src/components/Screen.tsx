import { FlashList, FlashListProps, FlashListRef } from '@shopify/flash-list';
import { StatusBar } from 'expo-status-bar';
import React, { useRef, useState } from 'react';
import {
  RefreshControl, ScrollView, StyleProp, StyleSheet, View, ViewStyle
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppSelector } from '~/hooks';
import { useAppTheme } from '~/hooks/theme';

import AuthLoadingModal from './AuthLoadingModal';

type StatusBarStyle = 'auto' | 'inverted' | 'light' | 'dark';

interface ScreenProps {
  onUpdate?(...args): unknown;
  children: React.ReactNode;
  startScrollFromBottom?: boolean;
  statusBarStyle?: StatusBarStyle;
  containerStyle?: StyleProp<ViewStyle>;
  refreshEnabled?: boolean;
}

const Screen = ({
  onUpdate,
  children,
  startScrollFromBottom,
  statusBarStyle,
  containerStyle,
  refreshEnabled = true,
}: ScreenProps) => {
  const { isAuthorizing } = useAppSelector((state) => state.account);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const scrollRef = useRef<ScrollView>(null);
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();

  const onRefresh = async () => {
    setRefreshing(true);
    await onUpdate();
    setRefreshing(false);
  };

  return (
    <View style={{ flex: 1 }}>
      {isAuthorizing && <AuthLoadingModal />}

      <StatusBar style={statusBarStyle || theme.statusBarStyle} />

      <ScrollView
        ref={scrollRef}
        nestedScrollEnabled
        contentContainerStyle={[
          { flexGrow: 1, paddingBottom: Math.max(insets.bottom + 60, 80) },
          styles.screen,
          containerStyle,
        ]}
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        overScrollMode='never'
        refreshControl={
          onUpdate
            ? (
              <RefreshControl
                colors={[theme.colors.primary]}
                refreshing={refreshing}
                onRefresh={onRefresh}
                enabled={refreshEnabled}
              />
            )
            : null
        }
        onContentSizeChange={
          startScrollFromBottom ? () => scrollRef.current.scrollToEnd() : undefined
        }
      >
        {children}
      </ScrollView>
    </View>
  );
};

export default Screen;

type ListScreenProps<T> = Omit<ScreenProps, 'children'> & FlashListProps<T>;

export const ListScreen = <T,>({
  onUpdate,
  startScrollFromBottom,
  statusBarStyle,
  containerStyle,
  data,
  ...listProps
}: ListScreenProps<T>) => {
  const { isAuthorizing } = useAppSelector((state) => state.account);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const theme = useAppTheme();
  const ref = useRef<FlashListRef<T>>(null);
  const insets = useSafeAreaInsets();

  const onRefresh = async () => {
    setRefreshing(true);
    await onUpdate();
    setRefreshing(false);
  };

  return (
    <View style={{ flex: 1 }}>
      {isAuthorizing && <AuthLoadingModal />}

      <StatusBar style={statusBarStyle || theme.statusBarStyle} />

      <View style={[{ flex: 1 }, styles.screen, containerStyle]}>
        <FlashList
          ref={ref}
          data={startScrollFromBottom ? data.toReversed() : data}
          overScrollMode={'never'}
          showsVerticalScrollIndicator={false}
          onRefresh={onUpdate ? onRefresh : undefined}
          refreshing={onUpdate ? refreshing : undefined}
          contentContainerStyle={{ paddingBottom: Math.max(insets.bottom + 60, 80) }}
          refreshControl={
            onUpdate
              ? (
                <RefreshControl
                  colors={[theme.colors.primary]}
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                />
              )
              : undefined
          }

          {...listProps}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    marginHorizontal: '4%',
  },
});
