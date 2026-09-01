import React from 'react';

import AutoHeightWebView from '~/components/AutoHeightWebView';
import Card from '~/components/Card';
import { useGlobalStyles } from '~/hooks';
import { useAppTheme } from '~/hooks/theme';
import { IAnnounce } from '~/models/announce';
import { httpClient } from '~/utils';
import { getStyles } from '~/utils/webView';

export default function AnnounceCard({ data: { isNew, html } }: { data: IAnnounce }) {
  const theme = useAppTheme();
  const globalStyles = useGlobalStyles();

  return (
    <Card style={isNew && globalStyles.primaryBackgroundColor}>
      <AutoHeightWebView
        source={{ html }}
        style={{ flex: 0, width: '100%' }}
        customStyle={getStyles(
          isNew ? theme.colors.primaryContrast : theme.colors.text,
          isNew ? theme.colors.text : theme.colors.primary
        )}
      />
    </Card>
  );
}
