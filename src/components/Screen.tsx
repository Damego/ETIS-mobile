import { StatusBar } from 'expo-status-bar';
import React, { useRef, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import { useAppSelector } from '~/hooks';
import { useAppTheme } from '~/hooks/theme';
import AuthLoadingModal from './AuthLoadingModal';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    // marginLeft: '2%',
  },
});

interface ScreenProps {
  onUpdate?(...args): unknown;
  children: React.ReactNode;
  startScrollFromBottom?: boolean;
}

const Screen = ({ onUpdate, children, startScrollFromBottom }: ScreenProps) => {
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

      <StatusBar style={"light"} />

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
        <View style={styles.screen}>{children}</View>
      </ScrollView>
    </View>
  );
};

export default Screen;
