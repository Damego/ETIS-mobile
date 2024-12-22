import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { Dimensions, View } from 'react-native';
import AutoHeightWebView from 'react-native-autoheight-webview';
import { isAudienceAvailable } from '~/api/psumaps';
import { useAppSelector } from '~/hooks';
import { IAudience } from '~/models/timeTable';

// Скрытие панели навигации
const mapsStyle = `
#root div:nth-child(1) {
  flex: 0 0 100% !important;
  width: ${Dimensions.get('window').width}px !important;
}

#root > div > div:nth-child(2) {
  display: none !important;
}

#root > div > div > div:nth-child(2) {
  display: none !important;
}

.maplibregl-ctrl-bottom-right  {
  display: none !important;
}
`;

const getScript = (ical: string) => `localStorage.setItem("ical_token", "${ical}");`;

function AudienceMap({ audience }: { audience: IAudience }) {
  const { iCalToken } = useAppSelector((state) => state.student);

  const audienceString = `${audience.number}/${audience.building}`;

  const { data: $isAudienceAvailable } = useQuery({
    queryFn: () => isAudienceAvailable(audienceString, iCalToken),
    queryKey: ['aud-avail', audienceString, iCalToken],
    enabled: !!iCalToken,
  });

  if (!iCalToken || !$isAudienceAvailable) return null;

  const params = `#q=${audienceString}`;

  return (
    <View style={{ flex: 1 }}>
      <AutoHeightWebView
        style={{ height: 200 }}
        source={{
          uri: `https://deploy-preview-86--psumaps-miniapp.netlify.app/${params}`,
        }}
        customStyle={mapsStyle}
        customScript={getScript(iCalToken)}
        domStorageEnabled
      />
    </View>
  );
}

export default React.memo(AudienceMap);