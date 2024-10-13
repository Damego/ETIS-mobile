import React from 'react';
import { View, useWindowDimensions } from 'react-native';
import BorderLine from '~/components/BorderLine';
import { LoadingContainer } from '~/components/LoadingScreen';
import NoData from '~/components/NoData';
import PageNavigator from '~/components/PageNavigator';
import Screen, { ListScreen } from '~/components/Screen';
import useMessagesQuery from '~/hooks/useMessagesQuery';
import { SceneProps } from '~/models/rn-tab-view';
import { MessagesShortcuts } from '~/screens/etis/main/components/MessagesShortcuts';

import MessageCard from '../components/MessageCard';

const Messages = ({ jumpTo, route }: SceneProps) => {
  const { height } = useWindowDimensions();
  const { data, isLoading, refresh, loadPage } = useMessagesQuery();

  const Navigation = () => (
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
  );

  // FlashList не позволяет для "пустого" компонента использовать всю доступную высоту окна, поэтому пока так
  // https://github.com/Shopify/flash-list/issues/848
  if (isLoading || !data) {
    return (
      <Screen>
        <Navigation />
        {isLoading ? <LoadingContainer /> : <NoData />}
      </Screen>
    );
  }

  return (
    <ListScreen
      onUpdate={refresh}
      ListHeaderComponent={<Navigation />}
      data={data ? data.messages : []}
      renderItem={({ item }) => <MessageCard data={item} page={data.page} />}
      keyExtractor={(item) => item[0].time}
      estimatedItemSize={10}
      ItemSeparatorComponent={BorderLine}
      contentContainerStyle={{ paddingBottom: height * 0.1 }}
    />
  );
};

export default Messages;
