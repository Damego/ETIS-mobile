import React from 'react';
import { useWindowDimensions } from 'react-native';
import { SceneMap, TabView } from 'react-native-tab-view';
import Messages from '~/screens/etis/main/messages//Messages';
import Announces from '~/screens/etis/main/messages/Announces';

const renderScene = SceneMap({
  messages: Messages,
  announces: Announces,
});

const MessagesTabs = () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'messages', title: 'messages' },
    { key: 'announces', title: 'announces' },
  ]);
  const layout = useWindowDimensions();

  return (
    <TabView
      style={{ flex: 1 }}
      lazy
      swipeEnabled={false}
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      renderTabBar={() => undefined}
      animationEnabled={false}
    />
  );
};

export default MessagesTabs;
