import { FlashList, FlashListProps } from '@shopify/flash-list';
import { StatusBar } from 'expo-status-bar';
import { StatusBarStyle } from 'expo-status-bar/src/StatusBar.types';
import React, { useRef, useState } from 'react';
import { RefreshControl, ScrollView, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useAppSelector } from '~/hooks';
import { useAppTheme } from '~/hooks/theme';

import AuthLoadingModal from './AuthLoadingModal';

interface ScreenProps {
  onUpdate?(...args): unknown;
  children: React.ReactNode;
  startScrollFromBottom?: boolean;
  statusBarStyle?: StatusBarStyle;
  containerStyle?: StyleProp<ViewStyle>;
}

const Screen = ({
  onUpdate,
  children,
  startScrollFromBottom,
  statusBarStyle,
  containerStyle,
}: ScreenProps) => {
  const { isAuthorizing } = useAppSelector((state) => state.auth);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const scrollRef = useRef<ScrollView>();
  const theme = useAppTheme();

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
        contentContainerStyle={{ flexGrow: 1 }}
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
        refreshControl={
          onUpdate ? (
            <RefreshControl
              colors={[theme.colors.primary]}
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          ) : null
        }
        onContentSizeChange={
          startScrollFromBottom ? () => scrollRef.current.scrollToEnd() : undefined
        }
      >
        <View style={[styles.screen, containerStyle]}>{children}</View>
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
  const { isAuthorizing } = useAppSelector((state) => state.auth);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const theme = useAppTheme();
  const ref = useRef<FlashList<never>>();

  const onRefresh = async () => {
    setRefreshing(true);
    await onUpdate();
    setRefreshing(false);
  };

  return (
    <View style={{ flex: 1 }}>
      {isAuthorizing && <AuthLoadingModal />}

      <StatusBar style={statusBarStyle || theme.statusBarStyle} />

      <View style={[styles.screen, containerStyle]}>
        <FlashList
          ref={ref}
          inverted={startScrollFromBottom}
          data={startScrollFromBottom ? data.toReversed() : data}
          overScrollMode={'never'}
          showsVerticalScrollIndicator={false}
          onRefresh={onUpdate ? onRefresh : undefined}
          refreshing={onUpdate ? refreshing : undefined}
          refreshControl={
            onUpdate ? (
              <RefreshControl
                colors={[theme.colors.primary]}
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            ) : undefined
          }
          /* eslint-disable-next-line react/jsx-props-no-spreading */
          {...listProps}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    marginHorizontal: '4%',
  },
});
