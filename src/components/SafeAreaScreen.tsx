import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '~/hooks/theme';
import { View } from 'react-native';

const SafeAreaScreen = ({ children }: { children: React.ReactNode }) => {
  const theme = useAppTheme();

  return (
    <View style={{ flex: 1, marginHorizontal: '4%' }}>
      <StatusBar style={theme.statusBarStyle} />
      {children}
    </View>
  );
};

export default SafeAreaScreen;
