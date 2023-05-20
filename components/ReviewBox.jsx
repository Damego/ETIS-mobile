import * as StoreReview from 'expo-store-review';
import React from 'react';
import { Alert, Button, Linking, Text, View } from 'react-native';

const ReviewBox = ({ setReviewed, setViewed }) => {
  const handleReview = async () => {
    if (await StoreReview.isAvailableAsync()) {
      StoreReview.requestReview().then(() => setReviewed());
    } else {
      let link = `${StoreReview.storeUrl()}&showAllReviews=true`;

      if (await Linking.canOpenURL(link)) {
        await Linking.openURL(link);
        setReviewed();
      }
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
export default ReviewBox;