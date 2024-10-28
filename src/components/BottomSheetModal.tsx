import {
  BottomSheetModalProps,
  BottomSheetModal as GorhomBottomSheetModal,
} from '@gorhom/bottom-sheet';
import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/src/types';
import React, { useImperativeHandle, useRef } from 'react';
import BottomSheetModalBackdrop from '~/components/BottomSheetModalBackdrop';
import { useGlobalStyles } from '~/hooks';
import useBackPress from '~/hooks/useBackPress';

type BottomSheetModal = BottomSheetModalMethods;

const BottomSheetModalComponent = React.forwardRef<BottomSheetModal, BottomSheetModalProps>(
  (props, ref) => {
    const { children, onDismiss, ...restProps } = props;
    const globalStyles = useGlobalStyles();
    const modalRef = useRef<BottomSheetModal>();
    const stateRef = useRef({
      isOpened: false,
    });

    // Библиотека самостоятельно не отслеживает нажатие кнопки назад, поэтому делаем всё сами
    useBackPress(() => {
      if (stateRef.current.isOpened) {
        modalRef.current.dismiss();
        return true;
      }
      return false;
    });

    useImperativeHandle(
      ref,
      () => ({
        ...modalRef.current,
        present: (data) => {
          modalRef.current.present(data);
          stateRef.current.isOpened = true;
        },
        dismiss: () => {
          modalRef.current.dismiss();
          stateRef.current.isOpened = false;
        },
      }),
      [modalRef.current]
    );

    const dismissModal = () => {
      modalRef.current.dismiss();
      stateRef.current.isOpened = false;
    };

    return (
      <GorhomBottomSheetModal
        ref={modalRef}
        backdropComponent={(props) => (
          // eslint-disable-next-line react/jsx-props-no-spreading
          <BottomSheetModalBackdrop {...props} onPress={dismissModal} />
        )}
        onDismiss={onDismiss ?? dismissModal}
        backgroundStyle={globalStyles.card}
        handleIndicatorStyle={{ backgroundColor: globalStyles.textColor.color }}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...restProps}
      >
        {children}
      </GorhomBottomSheetModal>
    );
  }
);

// eslint-disable-next-line @typescript-eslint/no-redeclare
const BottomSheetModal = BottomSheetModalComponent;
BottomSheetModal.displayName = 'BottomSheetModal';

export default BottomSheetModal;
