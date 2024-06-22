import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Text from '~/components/Text';
import { useAppSelector, useGlobalStyles } from '~/hooks';

export type Shortcut = 'timetable' | 'grades' | 'messages' | 'menu';

const Icon = ({
  iconName,
  shortcut,
  onPress,
  count,
  isCurrent,
}: {
  iconName: keyof typeof AntDesign.glyphMap;
  shortcut: Shortcut;
  onPress: (shortcut: Shortcut) => void;
  count?: number;
  isCurrent: boolean;
}) => {
  const globalStyles = useGlobalStyles();

  return (
    <TouchableOpacity
      onPress={() => onPress(shortcut)}
      style={[
        globalStyles.borderRadius,
        isCurrent ? globalStyles.secondaryBackgroundColor : null,
        { alignItems: 'center', paddingVertical: '2%', paddingHorizontal: '6%' },
      ]}
    >
      <AntDesign
        name={iconName}
        size={36}
        color={isCurrent ? globalStyles.primaryText.color : globalStyles.textColor.color}
      />

      {!!count && (
        <View
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            width: 20,
            height: 20,
            borderRadius: 10,
            backgroundColor: globalStyles.primaryText.color,

            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: 14, color: globalStyles.primaryContrastText.color }}>
            {count}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const Shortcuts = ({
  current,
  onPress,
}: {
  current: Shortcut;
  onPress: (shortcut: Shortcut) => void;
}) => {
  const { messageCount, announceCount } = useAppSelector((state) => state.student);

  return (
    <View style={styles.shortcutsContainer}>
      <Icon
        iconName={'calendar'}
        shortcut={'timetable'}
        onPress={onPress}
        isCurrent={current === 'timetable'}
      />
      <Icon
        iconName={'barschart'}
        shortcut={'grades'}
        onPress={onPress}
        isCurrent={current === 'grades'}
      />
      <Icon
        iconName={'message1'}
        shortcut={'messages'}
        count={messageCount + announceCount}
        onPress={onPress}
        isCurrent={current === 'messages'}
      />
      <Icon
        iconName={'appstore-o'}
        shortcut={'menu'}
        onPress={onPress}
        isCurrent={current === 'menu'}
      />
    </View>
  );
};

export default Shortcuts;

const styles = StyleSheet.create({
  shortcutsContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    marginTop: '4%',
  },
});
