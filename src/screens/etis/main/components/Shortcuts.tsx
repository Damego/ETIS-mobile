import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type {
  NavigationState,
  SceneRendererProps,
} from 'react-native-tab-view';

import Text from '~/components/Text';
import { useAppSelector, useGlobalStyles } from '~/hooks';
import { SHORTCUTS_BOTTOM_OFFSET } from '~/utils/bottomNav';

export type Shortcut = 'timetable' | 'grades' | 'messageTabs' | 'more';

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
    <TouchableOpacity onPress={() => onPress(shortcut)} style={styles.iconView}>
      <AntDesign
        name={iconName}
        size={24}
        color={isCurrent ? globalStyles.primaryText.color : globalStyles.textColor.color}
      />

      {Boolean(count) && (
        <View style={[styles.iconCounter, globalStyles.primaryBackgroundColor]}>
          <Text style={{ fontSize: 10, color: globalStyles.primaryContrastText.color }}>
            {count}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const Shortcuts = (
  props: SceneRendererProps & {
    navigationState: NavigationState<any>;
  }
) => {
  const globalStyles = useGlobalStyles();
  const insets = useSafeAreaInsets();
  const {
    jumpTo,
    navigationState,
    layout: { height },
  } = props;
  const currentShortcut = navigationState
    ? navigationState.routes[navigationState.index].key
    : 'timetable';

  const { messageCount, announceCount } = useAppSelector((state) => state.student);

  return (
    <View
      style={[
        styles.shortcutsWrapper,
        {
          bottom: insets.bottom > 0 ? insets.bottom * 0.9 : SHORTCUTS_BOTTOM_OFFSET,
        },
      ]}
    >
      <View
        style={[
          styles.shortcutsContainer,
          globalStyles.containerBackground,
          globalStyles.borderRadius,
        ]}
      >
        <Icon
          iconName={'calendar'}
          shortcut={'timetable'}
          onPress={jumpTo}
          isCurrent={currentShortcut === 'timetable'}
        />
        <Icon
          iconName={'barschart'}
          shortcut={'grades'}
          onPress={jumpTo}
          isCurrent={currentShortcut === 'grades'}
        />
        <Icon
          iconName={'message1'}
          shortcut={'messageTabs'}
          count={messageCount + announceCount}
          onPress={jumpTo}
          isCurrent={currentShortcut === 'messageTabs'}
        />
        <Icon
          iconName={'appstore-o'}
          shortcut={'more'}
          onPress={jumpTo}
          isCurrent={currentShortcut === 'more'}
        />
      </View>
    </View>
  );
};

export default Shortcuts;

const styles = StyleSheet.create({
  shortcutsWrapper: {
    position: 'absolute',
    zIndex: 1,
    alignSelf: 'center',
  },
  shortcutsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    paddingVertical: '2%',
    // Replaces react-native-shadow-2 (distance 20); works on all supported
    // Android API levels, unlike RN boxShadow which needs API 28+
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  iconView: {
    alignItems: 'center',
    paddingVertical: '2%',
    paddingHorizontal: '6%',
  },
  iconCounter: {
    position: 'absolute',
    right: '50%',
    width: 14,
    height: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
