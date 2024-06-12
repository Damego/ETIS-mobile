import React from 'react';
import LoadingScreen from '~/components/LoadingScreen';
import NoData from '~/components/NoData';
import PageNavigator from '~/components/PageNavigator';
import Screen from '~/components/Screen';
import useMessagesQuery from '~/hooks/useMessagesQuery';

import MessagePreview from './MessagePreview';

const Messages = () => {
  const { data, isLoading, refresh, loadPage } = useMessagesQuery();

  if (isLoading) return <LoadingScreen onRefresh={refresh} />;
  if (!data) return <NoData onRefresh={refresh} />;

  return (
    <Screen onUpdate={refresh}>
      <PageNavigator
        firstPage={1}
        lastPage={data.lastPage}
        currentPage={data.page}
        onPageChange={loadPage}
      />

      {data.messages.map((messageBlock) => (
        <MessagePreview data={messageBlock} key={messageBlock[0].time} page={data.page} />
      ))}
    </Screen>
  );
};

export default Messages;
