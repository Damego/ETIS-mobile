import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Отступ от нижнего края экрана до плашки навигации (Shortcuts)
export const SHORTCUTS_BOTTOM_OFFSET = 20;

// Нижний отступ контента экранов: контент не должен уходить под
// плавающую навигацию (Shortcuts). 60 — высота плашки с запасом,
// 80 — минимум для экранов без системной навигации (insets.bottom = 0)
const SHORTCUTS_RESERVED_HEIGHT = 60;

export const useBottomNavPadding = () => {
  const insets = useSafeAreaInsets();

  return Math.max(insets.bottom + SHORTCUTS_RESERVED_HEIGHT, 80);
};
