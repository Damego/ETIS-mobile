import { BottomSheetScrollView } from '@expo/ui/community/bottom-sheet';
import React from 'react';
import {
  StyleProp, StyleSheet, useWindowDimensions, ViewStyle
} from 'react-native';

import Text from '~/components/Text';
import { fontSize } from '~/utils/texts';

interface BottomSheetContentProps {
  readonly title?: string;
  readonly style?: StyleProp<ViewStyle>;
  /**
   * Для шторок БЕЗ snapPoints (режим fitToContents — высота шторки
   * по контенту). В этом режиме RNHostView(matchContents) меряет контент
   * циклически: `width: '100%'` разрешается от хоста, хост — от контента,
   * и колонка схлопывается по ширине текста. Явная ширина окна разрывает
   * цикл, а maxHeight ограничивает высоту — ScrollView получает bounded
   * height и скроллится, длинный контент не уходит за край экрана.
   */
  readonly fitContent?: boolean;
  readonly children: React.ReactNode;
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
const BottomSheetContent = ({ title, style, fitContent, children }: BottomSheetContentProps) => {
  const { width, height } = useWindowDimensions();

  return (
    <BottomSheetScrollView
      style={fitContent ? { width, maxHeight: height * 0.8 } : { flex: 1 }}
      contentContainerStyle={[styles.content, style]}
    >
      {Boolean(title) && <Text style={styles.title}>{title}</Text>}
      {children}
    </BottomSheetScrollView>
  );
};

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
