import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '~/hooks/theme';

const SafeAreaScreen = ({ children }: { children: React.ReactNode }) => {
  const theme = useAppTheme();

  return (
    <SafeAreaView style={{ flex: 1, marginHorizontal: '4%' }}>
      <StatusBar style={theme.statusBarStyle} />
      {children}
    </SafeAreaView>
  );
};

export default SafeAreaScreen;
