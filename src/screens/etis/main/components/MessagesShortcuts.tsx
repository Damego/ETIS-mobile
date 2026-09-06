import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import ClickableText from '~/components/ClickableText';
import { useGlobalStyles } from '~/hooks';

export const MessagesShortcuts = ({
  currentShortcut,
  onShortcutPress,
}: {
  readonly currentShortcut: string;
  readonly onShortcutPress: (shortcut: string) => void;
}) => {
  const { t } = useTranslation();
  const globalStyles = useGlobalStyles();

  const shortcuts = {
    messages: t('shortcuts.messages'),
    announces: t('shortcuts.announces'),
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
          disabled={currentShortcut === shortcut}
          onPress={() => onShortcutPress(shortcut)}
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
