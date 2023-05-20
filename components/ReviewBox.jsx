import * as StoreReview from 'expo-store-review';
import React from 'react';
import { Alert, Button, Linking, Text, View } from 'react-native';

const ReviewVox = ({ setReviewed, setViewed }) => {
  const handleReview = async () => {
    if (await StoreReview.isAvailableAsync()) {
      await StoreReview.requestReview();
    } else {
      let link = `${StoreReview.storeUrl()}&showAllReviews=true`;
      console.warn(link);

      Linking.canOpenURL(link)
        .then(() => {
          Linking.openURL(link)
            .then(() => {
              setReviewed();
            })
            .catch((e) => console.log(e));
        })
        .catch((e) => console.log(e));
    }
  };

  const handleDismiss = () => {
    Alert.alert('Может быть, в другой раз');
    setViewed();
  };

  return (
    <View
      style={{
        backgroundColor: '#DDD',
        borderRadius: 10,
        padding: 15,
      }}
    >
      <Text
        style={{
          fontWeight: '600',
          fontSize: 20,
        }}
      >
        Вам нравится приложение?
      </Text>

      <View
        style={{
          flexDirection: 'row',
          paddingTop: '5%',
        }}
      >
        <View style={{ flex: 1 }}>
          <Button title="Оставить отзыв" onPress={() => handleReview()} />
        </View>

        <View style={{ flex: 1 }}>
          <Button title="Нет, спасибо" color="#999" onPress={() => handleDismiss()} />
        </View>
      </View>
    </View>
  );
};
export default ReviewVox;