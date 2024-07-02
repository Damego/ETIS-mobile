import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useGlobalStyles } from '~/hooks';

import Screen from './Screen';

const styles = StyleSheet.create({
  textView: {
    marginBottom: '3%',
    height: '15%',
    width: '50%',
  },
  cardView: {
    flex: 1,
    marginBottom: '3%',
  },
});

const EmptyCard = () => {
  const globalStyles = useGlobalStyles();

  return (
    <View style={{ flex: 1 }}>
      <View style={[styles.textView, globalStyles.card, globalStyles.borderRadius]} />
      <View style={[styles.cardView, globalStyles.card, globalStyles.borderRadius]} />
    </View>
  );
};

export const LoadingContainer = () => (
  <View style={{ flex: 1 }}>
    <View style={{ marginTop: '10%' }} />
    <EmptyCard />
    <EmptyCard />
    <EmptyCard />
    <EmptyCard />
  </View>
);

const LoadingScreen = ({ onRefresh }: { onRefresh?(): void }) => (
  <Screen onUpdate={onRefresh}>
    <LoadingContainer />
  </Screen>
);

export default LoadingScreen;
