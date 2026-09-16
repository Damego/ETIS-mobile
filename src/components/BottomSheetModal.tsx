import {
  BottomSheetMethods,
  BottomSheetModal as ExpoBottomSheetModal,
  BottomSheetProps,
} from '@expo/ui/community/bottom-sheet';
import React, { useImperativeHandle, useRef } from 'react';

import { useGlobalStyles } from '~/hooks';

// Слияние объявлений: тип `BottomSheetModal` = BottomSheetMethods, поэтому
// потребители пишут `useRef<BottomSheetModal | null>(null)`.
type BottomSheetModal = BottomSheetMethods;

/**
 * Обёртка над `@expo/ui/community/bottom-sheet`.
 *
 * Гонка в `BottomSheet.android.tsx`: при повторном `snapToIndex(0)` на уже
 * открытой шторке со списком snapPoints JS вызывает нативный
 * `ModalBottomSheetView.partialExpand()`. Если шторка в этот момент
 * пересобирается (закрытие/повторное открытие), нативная вьюха с прежним
 * тегом уже размонтирована, и вызов падает:
 *   Call to function 'ModalBottomSheetView.partialExpand' has been rejected.
 *   → Unable to find the class ... ComposeFunctionHolder view with tag N
 * (expo/expo#46302; исправление в ядре — PR expo/expo#49634/46367).
 *
 * Поэтому императивные методы дедуплицируются: `present()` не выполняется
 * повторно, пока шторка уже открыта или анимируется, а `snapTo*` не уходит
 * в натив до фактического открытия. Флаги снимаются в `onDismiss` — то есть
 * и при программном закрытии, и при свайпе/тапе по фону/кнопке «Назад».
 */
const BottomSheetModalComponent = React.forwardRef<BottomSheetModal, BottomSheetProps>(
  ({ children, onDismiss, ...restProps }, ref) => {
    const globalStyles = useGlobalStyles();
    const modalRef = useRef<BottomSheetModal | null>(null);
    const isPresented = useRef(false);
    const isTransitioning = useRef(false);

    useImperativeHandle(ref, () => {
      const isIdle = () => !isTransitioning.current;

      const snapTo = (call: (methods: BottomSheetModal) => void) => {
        if (!isPresented.current || !isIdle()) return;
        if (modalRef.current) call(modalRef.current);
      };

      const closeWith = (call: (methods: BottomSheetModal) => void) => {
        if (!isPresented.current || !isIdle()) return;
        isPresented.current = false;
        isTransitioning.current = true;
        if (modalRef.current) call(modalRef.current);
      };

      return {
        snapToIndex: (index) => snapTo((methods) => methods.snapToIndex(index)),
        snapToPosition: (position) => snapTo((methods) => methods.snapToPosition(position)),
        expand: () => snapTo((methods) => methods.expand()),
        collapse: () => snapTo((methods) => methods.collapse()),
        close: () => closeWith((methods) => methods.close()),
        forceClose: () => closeWith((methods) => methods.forceClose()),
        present: () => {
          if (isPresented.current || !isIdle()) return;
          isPresented.current = true;
          modalRef.current?.present();
        },
        dismiss: () => closeWith((methods) => methods.dismiss()),
      };
    }, []);

    const handleDismiss = () => {
      isPresented.current = false;
      isTransitioning.current = false;
      onDismiss?.();
    };

    return (
      <ExpoBottomSheetModal
        ref={modalRef}
        enablePanDownToClose
        backgroundStyle={globalStyles.card}
        onDismiss={handleDismiss}
        {...restProps}
      >
        {children}
      </ExpoBottomSheetModal>
    );
  }
);

// eslint-disable-next-line @typescript-eslint/no-redeclare -- declaration merging so useRef<BottomSheetModal> resolves to BottomSheetMethods
const BottomSheetModal = BottomSheetModalComponent;
BottomSheetModal.displayName = 'BottomSheetModal';

export default BottomSheetModal;
