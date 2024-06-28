import React from 'react';
import { View } from 'react-native';
import BorderLine from '~/components/BorderLine';
import { LoadingContainer } from '~/components/LoadingScreen';
import NoData from '~/components/NoData';
import PageNavigator from '~/components/PageNavigator';
import { ListScreen } from '~/components/Screen';
import useMessagesQuery from '~/hooks/useMessagesQuery';
import { SceneProps } from '~/models/rn-tab-view';
import { MessagesShortcuts } from '~/screens/etis/main/components/MessagesShortcuts';

import MessageCard from '../components/MessageCard';

const Messages = ({ jumpTo, route }: SceneProps) => {
  const { data, isLoading, refresh, loadPage } = useMessagesQuery();

  return (
    <ListScreen
      onUpdate={refresh}
      ListHeaderComponent={
        <View style={{ marginBottom: '2%', gap: 8 }}>
          <MessagesShortcuts onShortcutPress={jumpTo} currentShortcut={route.key} />
          {!!data && (
            <PageNavigator
              firstPage={1}
              lastPage={data.lastPage}
              currentPage={data.page}
              onPageChange={loadPage}
            />
          )}
        </View>
      }
      data={data ? data.messages : []}
      renderItem={({ item }) => <MessageCard data={item} page={data.page} />}
      keyExtractor={(item) => item[0].time}
      estimatedItemSize={10}
      ListEmptyComponent={isLoading ? <LoadingContainer /> : !data ? <NoData /> : undefined}
      ItemSeparatorComponent={BorderLine}
    />
  );
};

export default Messages;
