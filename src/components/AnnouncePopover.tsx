import React from 'react';
import AutoHeightWebView from 'react-native-autoheight-webview';
import Popover, { PopoverPlacement } from 'react-native-popover-view';

import { useGlobalStyles } from '~/hooks';
import { useAppTheme } from '~/hooks/theme';
import { getStyles } from '~/utils/webView';
import { Button } from './Button';

const AnnouncePopover = ({ data }: { data: string }) => {
  const globalStyles = useGlobalStyles();
  const theme = useAppTheme();

  return (
    <Popover
      placement={PopoverPlacement.FLOATING}
      from={(_, showPopover) => (
        <Button text={'Объявление'} onPress={showPopover} variant={'card'} />
      )}
      popoverStyle={{
        borderRadius: globalStyles.border.borderRadius,
        backgroundColor: globalStyles.block.backgroundColor,
        padding: '2%',
      }}
    >
      <AutoHeightWebView
        source={{ html: data }}
        customStyle={getStyles(theme.colors.textForBlock, theme.colors.primary)}
      />
    </Popover>
  );
};

export default AnnouncePopover;
