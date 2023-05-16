import Constants from 'expo-constants';
import { StatusBar } from 'expo-status-bar';
import React, { useRef, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import Header from './Header';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    width: '96%',
    marginLeft: '2%',
  },
});

const Screen = ({
  headerText,
  scrollHeader = true,
  onUpdate,
  disableRefresh,
  children,
  onBackPageClick,
  startScrollFromBottom,
}) => {
  const [refreshing, setRefreshing] = useState(false);
  const scrollRef = useRef();

  // not a useCallback hook because `onUpdate` function of parent component uses first state of useState hooks
  const onRefresh = async () => {
    setRefreshing(true);
    await onUpdate();
    setRefreshing(false);
  };

  return (
    <View style={{ marginTop: Constants.statusBarHeight, flex: 1 }}>
      <StatusBar style={'dark'} />
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
