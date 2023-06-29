import { useRoute } from '@react-navigation/native';
import Constants from 'expo-constants';
import { StatusBar } from 'expo-status-bar';
import React, { ReactElement, useRef, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import { useAppSelector } from '../hooks';
import { useAppColorScheme } from '../hooks/theme';
import AuthLoadingModal from './AuthLoadingModal';
import Header from './Header';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    width: '96%',
    marginLeft: '2%',
  },
});

interface ScreenProps {
  headerText?: string;
  scrollHeader?: boolean;
  onUpdate?(arg?: any): Promise<void>;
  children: ReactElement | ReactElement[];
  onBackPageClick?(): void | Promise<void>;
  startScrollFromBottom?: boolean;
}

const Screen = ({
  headerText,
  scrollHeader = true,
  onUpdate,
  children,
  onBackPageClick,
  startScrollFromBottom,
}: ScreenProps) => {
  const { isAuthorizing } = useAppSelector((state) => state.auth);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const scrollRef = useRef<ScrollView>();
  const route = useRoute();
  headerText = headerText || route.name;

  const onRefresh = async () => {
    setRefreshing(true);
    await onUpdate();
    setRefreshing(false);
  };

  return (
    <View style={{ marginTop: Constants.statusBarHeight, flex: 1 }}>
      {isAuthorizing && <AuthLoadingModal />}

      <StatusBar style={useAppColorScheme() === 'light' ? 'dark' : 'light'} />

      {!scrollHeader && <Header text={headerText} onBackButtonClick={onBackPageClick} />}
      <ScrollView
        ref={startScrollFromBottom ? scrollRef : undefined}
        contentContainerStyle={{ flexGrow: 1 }}
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
        refreshControl={
          onUpdate ? <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> : null
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
