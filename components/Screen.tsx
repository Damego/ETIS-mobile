import Constants from 'expo-constants';
import { StatusBar } from 'expo-status-bar';
import React, { ReactElement, useRef, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import Header from './Header';
import { useAppColorScheme } from '../hooks/theme';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    width: '96%',
    marginLeft: '2%',
  },
});

interface ScreenProps {
  headerText: string;
  scrollHeader?: boolean;
  onUpdate?(): Promise<void>;
  disableRefresh?: boolean;
  children: ReactElement | ReactElement[];
  onBackPageClick?(): void | Promise<void>;
  startScrollFromBottom?: boolean;
}

const Screen = ({
  headerText,
  scrollHeader = true,
  onUpdate,
  disableRefresh,
  children,
  onBackPageClick,
  startScrollFromBottom,
}: ScreenProps) => {
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const scrollRef = useRef<ScrollView>();

  const onRefresh = async () => {
    setRefreshing(true);
    await onUpdate();
    setRefreshing(false);
  };

  return (
    <View style={{ marginTop: Constants.statusBarHeight, flex: 1 }}>
      <StatusBar style={useAppColorScheme() === 'dark' ? 'light' : 'dark'} />
      {!scrollHeader && <Header text={headerText} onBackButtonClick={onBackPageClick} />}
      <ScrollView
        ref={startScrollFromBottom ? scrollRef : undefined}
        contentContainerStyle={{ flexGrow: 1 }}
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
        refreshControl={
          !disableRefresh ? <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> : null
        }
        onContentSizeChange={
          startScrollFromBottom ? () => scrollRef.current.scrollToEnd() : undefined
        }
      >
        <View style={styles.screen}>
          {scrollHeader && <Header text={headerText} onBackButtonClick={onBackPageClick} />}
          {children}
        </View>
      </ScrollView>
    </View>
  );
};

export default Screen;
