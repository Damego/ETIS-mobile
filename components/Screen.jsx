import Constants from 'expo-constants';
import React, { useCallback, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import Header from './Header';

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#F8F8FA',
    height: '100%',
  },
});

const Screen = ({ headerText, onUpdate, children }) => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await onUpdate();
    setRefreshing(false);
  };

  return (
    <View style={{ marginTop: Constants.statusBarHeight }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.screen}>
          <Header text={headerText} />
          {children}
        </View>
      </ScrollView>
    </View>
  );
};

export default Screen;
