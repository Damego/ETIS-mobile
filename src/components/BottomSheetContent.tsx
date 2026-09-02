import { BottomSheetScrollView } from '@expo/ui/community/bottom-sheet';
import React from 'react';
import { StyleSheet } from 'react-native';

import Text from '~/components/Text';
import { fontSize } from '~/utils/texts';

interface BottomSheetContentProps {
  title?: string;
  children: React.ReactNode;
}

/**
 * Единое содержимое bottom sheet.
 *
 * Проп `style` самого BottomSheetModal игнорируется нативной реализацией
 * @expo/ui (Android), поэтому отступы задаются здесь — на contentContainer
 * ScrollView. Без этого контент прилипает к краям шторки и к drag handle.
 *
 * `flex: 1` на ScrollView безвреден в режиме fitToContents (Yoga считает
 * высоту по контенту) и необходим при явных snapPoints, чтобы прокрутка
 * работала по всей высоте шторки.
 */
const BottomSheetContent = ({ title, children }: BottomSheetContentProps) => (
  <BottomSheetScrollView style={{ flex: 1 }} contentContainerStyle={styles.content}>
    {Boolean(title) && <Text style={styles.title}>{title}</Text>}
    {children}
  </BottomSheetScrollView>
);

export default BottomSheetContent;

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: '5%',
    paddingTop: 8,
    paddingBottom: 24,
    gap: 8,
  },
  title: {
    ...fontSize.slarge,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
});
