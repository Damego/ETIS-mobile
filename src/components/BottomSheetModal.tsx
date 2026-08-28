import {
  BottomSheetMethods,
  BottomSheetModal as ExpoBottomSheetModal,
  BottomSheetProps,
} from '@expo/ui/community/bottom-sheet';
import React from 'react';

import { useGlobalStyles } from '~/hooks';

type BottomSheetModal = BottomSheetMethods;

const BottomSheetModalComponent = React.forwardRef<BottomSheetModal, BottomSheetProps>(
  ({ children, onDismiss, ...restProps }, ref) => {
    const globalStyles = useGlobalStyles();

    return (
      <ExpoBottomSheetModal
        ref={ref}
        onDismiss={onDismiss}
        backgroundStyle={globalStyles.card}
        // Разрешаем закрытие свайпом вниз, тапом по фону и кнопкой «Назад»
        enablePanDownToClose
        {...restProps}
      >
        {children}
      </ExpoBottomSheetModal>
    );
  }
);

// eslint-disable-next-line @typescript-eslint/no-redeclare
const BottomSheetModal = BottomSheetModalComponent;
BottomSheetModal.displayName = 'BottomSheetModal';

export default BottomSheetModal;
