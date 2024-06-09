import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';

import { useGlobalStyles } from '~/hooks';
import { fontSize } from '~/utils/texts';
import ClickableText from './ClickableText';

const styles = StyleSheet.create({
  view: {
    alignItems: 'center',
  },
  scrollContainer: {
    gap: 5,
  },
  button: {
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeButtonView: {
    borderRadius: 10,
  },
  activeButtonText: {
    color: '#FFFFFF',
  },
});

const ActiveButton = ({ number }: { number: string | number }) => {
  const globalStyles = useGlobalStyles();

  return (
    <View style={[styles.button, styles.activeButtonView, globalStyles.primaryBackgroundColor]}>
      <Text style={[fontSize.large, styles.activeButtonText]}>{number}</Text>
    </View>
  );
};

const PageNavigator = ({
  firstPage,
  currentPage,
  lastPage,
  onPageChange,
  pageStyles = {},
}: {
  firstPage: number;
  currentPage: number;
  lastPage: number;
  onPageChange(page: number): void;
  pageStyles?: {
    [page: number]: {
      view?: StyleProp<ViewStyle>;
      text?: StyleProp<TextStyle>;
    };
  };
}) => {
  const globalStyles = useGlobalStyles();
  const [pages, setPages] = useState<number[]>([]);
  const ref = useRef<ScrollView>();

  const generateButtons = () => {
    const array: number[] = [];
    for (let i = firstPage; i <= lastPage; i += 1) {
      array.push(i);
    }
    setPages(array);
  };

  useEffect(() => {
    generateButtons();
  }, []);

  useEffect(() => {
    if (!pages.length) return;

    const x =
      (currentPage - firstPage) * styles.button.width +
      (currentPage - firstPage) * styles.scrollContainer.gap;

    ref.current.scrollTo({ x });
  }, [pages]);

  return (
    <View style={styles.view}>
      <ScrollView
        ref={ref}
        horizontal
        contentContainerStyle={styles.scrollContainer}
        showsHorizontalScrollIndicator={false}
      >
        {pages.map((number) =>
          currentPage !== number ? (
            <ClickableText
              viewStyle={[styles.button, pageStyles[number]?.view]}
              textStyle={[fontSize.large, globalStyles.textColor, pageStyles[number]?.text]}
              text={number}
              onPress={() => onPageChange(number)}
              key={number}
            />
          ) : (
            <ActiveButton number={number} key={number} />
          )
        )}
      </ScrollView>
    </View>
  );
};

export default PageNavigator;
