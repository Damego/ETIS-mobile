import React from 'react';
import { StyleSheet, View } from 'react-native';
import ClickableText from '~/components/ClickableText';
import { useGlobalStyles } from '~/hooks';

export const MessagesShortcuts = ({
  currentShortcut,
  onShortcutPress,
}: {
  currentShortcut: string;
  onShortcutPress: (shortcut: string) => void;
}) => {
  const globalStyles = useGlobalStyles();

  const shortcuts = {
    messages: 'Сообщения',
    announces: 'Объявления',
  };

  return (
    <View style={styles.container}>
      {Object.entries(shortcuts).map(([shortcut, name]) => (
        <ClickableText
          key={shortcut}
          viewStyle={[
            styles.buttonContainer,
            currentShortcut === shortcut && globalStyles.primaryBackgroundColor,
          ]}
          textStyle={[
            styles.buttonText,
            currentShortcut === shortcut && globalStyles.primaryContrastText,
          ]}
          onPress={() => onShortcutPress(shortcut)}
          disabled={currentShortcut === shortcut}
        >
          {name}
        </ClickableText>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', justifyContent: 'space-between' },
  buttonContainer: { paddingVertical: '2%', paddingHorizontal: '4%', borderRadius: 100 },
  buttonText: { fontWeight: '600', fontSize: 18 },
});
