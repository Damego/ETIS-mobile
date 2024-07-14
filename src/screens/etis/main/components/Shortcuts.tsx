import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import type {
  NavigationState,
  SceneRendererProps,
} from 'react-native-tab-view/lib/typescript/src/types';
import Text from '~/components/Text';
import { useAppSelector, useGlobalStyles } from '~/hooks';

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

const Shortcuts = (
  props: SceneRendererProps & {
    navigationState: NavigationState<any>;
  }
) => {
  const { jumpTo, navigationState } = props;
  const currentShortcut = navigationState
    ? navigationState.routes[navigationState.index].key
    : 'timetable';

  const { messageCount, announceCount } = useAppSelector((state) => state.student);

  return (
    <View style={styles.shortcutsContainer}>
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
  );
};

export default Shortcuts;

const styles = StyleSheet.create({
  shortcutsContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    marginVertical: '4%',
    paddingHorizontal: '4%', // marginHorizontal не работает, если компонент исплользуется как TabBar для react-native-tab-view
  },
});
