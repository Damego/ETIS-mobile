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

const EmptyText = () => {
  const globalStyles = useGlobalStyles();
  return <View style={[{ height: '10%' }, globalStyles.card, globalStyles.borderRadius]} />;
};

const CardsContainerVariant = () => (
  <View style={{ flex: 1 }}>
    <View style={{ marginTop: '10%' }} />
    <EmptyCard />
    <EmptyCard />
    <EmptyCard />
    <EmptyCard />
  </View>
);

const TextsContainerVariant = () => (
  <View style={{ flex: 1, gap: 8 }}>
    <View style={{ marginTop: '10%' }} />
    <EmptyText />
    <EmptyText />
    <EmptyText />
    <EmptyText />
    <EmptyText />
    <EmptyText />
    <EmptyText />
    <EmptyText />
  </View>
);

export const LoadingContainer = ({ variant }: { variant?: 'cards' | 'texts' }) => {
  if (!variant || variant === 'cards') {
    return <CardsContainerVariant />;
  } else if (variant === 'texts') {
    return <TextsContainerVariant />;
  }
};

const LoadingScreen = ({
  onRefresh,
  variant,
}: {
  onRefresh?(): void;
  variant?: 'cards' | 'texts';
}) => (
  <Screen onUpdate={onRefresh}>
    <LoadingContainer variant={variant || 'cards'} />
  </Screen>
);

export default LoadingScreen;
