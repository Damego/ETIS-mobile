import * as StoreReview from 'expo-store-review';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Linking, View } from 'react-native';

import { Button } from '~/components/Button';
import Text from '~/components/Text';
import { useGlobalStyles } from '~/hooks';
import { fontSize } from '~/utils/texts';

const ReviewBox = ({
  setReviewed,
  setViewed,
}: {
  setReviewed: () => void;
  setViewed: () => void;
}) => {
  const { t } = useTranslation();
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
    Alert.alert(t('review.maybeLater'));
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
      <Text style={[fontSize.large, { fontWeight: '600' }]}>
        {t('review.question')}
      </Text>

      <View
        style={{
          flexDirection: 'row',
          paddingTop: '5%',
        }}
      >
        <View style={{ flex: 1, marginHorizontal: '1%' }}>
          <Button text={t('review.leaveReview')} onPress={() => handleReview()} variant={'primary'} />
        </View>

        <View style={{ flex: 1, marginHorizontal: '1%' }}>
          <Button text={t('review.noThanks')} onPress={() => handleDismiss()} variant={'secondary'} />
        </View>
      </View>
    </View>
  );
};
export default ReviewBox;
