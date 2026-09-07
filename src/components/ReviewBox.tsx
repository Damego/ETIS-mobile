import AntDesign from '@expo/vector-icons/AntDesign';
import * as StoreReview from 'expo-store-review';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Linking, StyleSheet, View } from 'react-native';

import { Button } from '~/components/Button';
import Card from '~/components/Card';
import Text from '~/components/Text';
import { useGlobalStyles } from '~/hooks';
import logger from '~/utils/logger';
import { fontSize } from '~/utils/texts';

const ReviewBox = ({
  setReviewed,
  setViewed,
}: {
  readonly setReviewed: () => void;
  readonly setViewed: () => void;
}) => {
  const { t } = useTranslation();
  const globalStyles = useGlobalStyles();

  const openStoreReviews = async () => {
    // storeUrl() по контракту возвращает string | null (web, отсутствие
    // playStoreUrl в конфиге); конкатенация с null даёт битую ссылку.
    const baseUrl = StoreReview.storeUrl();
    if (!baseUrl) {
      logger.warn('ReviewBox: store URL is not configured');
      return;
    }

    const link = baseUrl.includes('?')
      ? `${baseUrl}&showAllReviews=true`
      : `${baseUrl}?showAllReviews=true`;
    if (await Linking.canOpenURL(link)) {
      await Linking.openURL(link);
      setReviewed();
    }
  };

  const handleReview = async () => {
    if (await StoreReview.isAvailableAsync()) {
      try {
        // Нативный модуль реджектит промис, если ревью-флоу не запустился
        // (сборка установлена не из Play Store) — тогда открываем страницу
        // отзывов в магазине напрямую.
        await StoreReview.requestReview();
        setReviewed();
        return;
      } catch (error) {
        logger.warn('ReviewBox: native review flow failed', error);
      }
    }

    await openStoreReviews();
  };

  const handleDismiss = () => {
    setViewed();
  };

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <AntDesign name={'star'} size={28} color={globalStyles.primaryText.color} />
        <View style={styles.headerText}>
          <Text style={styles.title}>{t('review.question')}</Text>
          <Text style={[styles.subtitle, globalStyles.textColor2]}>{t('review.subtitle')}</Text>
        </View>
      </View>

      <View style={styles.buttons}>
        <Button
          text={t('review.leaveReview')}
          variant={'primary'}
          fontStyle={fontSize.medium}
          onPress={() => handleReview()}
        />
        <Button
          text={t('review.noThanks')}
          variant={'secondary'}
          fontStyle={fontSize.medium}
          onPress={() => handleDismiss()}
        />
      </View>
    </Card>
  );
};
export default ReviewBox;

const styles = StyleSheet.create({
  card: {
    padding: '4%',
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  title: {
    ...fontSize.medium,
    fontWeight: '600',
  },
  subtitle: {
    ...fontSize.small,
  },
  buttons: {
    flexDirection: 'row',
    gap: 8,
  },
});
