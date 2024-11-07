import { useAssets } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import React, { useEffect, useState } from 'react';
import Markdown from 'react-native-markdown-display';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '~/components/Card';
import LoadingScreen from '~/components/LoadingScreen';
import Screen from '~/components/Screen';
import { useGlobalStyles } from '~/hooks';

import releaseNotesFile from '../../../release-notes.md';

const ReleaseNotes = () => {
  const [assets] = useAssets([releaseNotesFile]);
  const [notes, setNotes] = useState<string>();
  const globalStyles = useGlobalStyles();

  useEffect(() => {
    if (!assets || !assets.length) return;

    FileSystem.readAsStringAsync(assets[0].localUri).then((data) => {
      setNotes(data);
    });
  }, [assets]);

  if (!notes) return <LoadingScreen />;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Screen>
        <Card>
          <Markdown style={{ body: globalStyles.textColor }}>{notes}</Markdown>
        </Card>
      </Screen>
    </SafeAreaView>
  );
};

export default ReleaseNotes;
