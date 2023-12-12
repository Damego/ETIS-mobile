import * as StoreReview from 'expo-store-review';
import React from 'react';
import { Alert, Button, Linking, Text, View } from 'react-native';

import { useGlobalStyles } from '../hooks';
import { fontSize } from '../utils/texts';

const ReviewBox = ({ setReviewed, setViewed }) => {
  const globalStyles = useGlobalStyles();

  const handleReview = async () => {
    if (await StoreReview.isAvailableAsync()) {
      StoreReview.requestReview().then(() => setReviewed());
      return;
    }

    const link = `${StoreReview.storeUrl()}&showAllReviews=true`;
    if (await Linking.canOpenURL(link)) {
      await Linking.openURL(link);
      setReviewed();
    }
  };

  const handleDismiss = () => {
    Alert.alert('Может быть, в другой раз');
    setViewed();
  };

  return (
    <View
      style={[
        globalStyles.border,
        globalStyles.block,
        {
          padding: '4%',
        },
      ]}
    >
      <Text
        style={[
          fontSize.large,
          globalStyles.fontColorForBlock,
          {
            fontWeight: '600',
          },
        ]}
      >
        Вам нравится приложение?
      </Text>

      <View
        style={{
          flexDirection: 'row',
          paddingTop: '5%',
        }}
      >
        <View style={{ flex: 1, marginHorizontal: '1%' }}>
          <Button title="Оставить отзыв" onPress={() => handleReview()} />
        </View>

        <View style={{ flex: 1, marginHorizontal: '1%' }}>
          <Button title="Нет, спасибо" color="#999" onPress={() => handleDismiss()} />
        </View>
      </View>
    </View>
  );
};
export default ReviewBox;
