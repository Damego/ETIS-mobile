import { AntDesign } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

import { useGlobalStyles } from '../hooks';
import { fontSize } from '../utils/texts';
import ClickableText from './ClickableText';

const styles = StyleSheet.create({
  containerView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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

const Arrow = ({ onClick, name }: { onClick(): void; name: keyof typeof AntDesign.glyphMap }) => {
  const {
    colors: { primary },
  } = useTheme();

  return (
    <TouchableOpacity style={styles.button} onPress={onClick}>
      <AntDesign name={name} size={20} color={primary} />
    </TouchableOpacity>
  );
};

const ActiveButton = ({ number }: { number: string | number }) => {
  const globalStyles = useGlobalStyles();

  return (
    <View style={[styles.button, styles.activeButtonView, globalStyles.primaryBackgroundColor]}>
      <Text style={[fontSize.large, styles.activeButtonText]}>{number}</Text>
    </View>
  );
};

const HiddenView = () => <View style={styles.button}></View>;

const calculateLimits = (firstPage: number, currentPage: number, lastPage: number) => {
  const limits = 3;
  if (lastPage - firstPage <= limits * 2) {
    return { leftLimit: firstPage, rightLimit: lastPage };
  }

  let leftLimit = currentPage - limits;
  let rightLimit = currentPage + limits;

  if (currentPage - firstPage <= limits) {
    leftLimit = firstPage;
    rightLimit = firstPage + limits * 2;
  }
  if (lastPage - currentPage <= limits) {
    rightLimit = lastPage;
    leftLimit = lastPage - limits * 2;
  }

  return { leftLimit, rightLimit };
};

const getNewButtonArray = (firstPage: number, currentPage: number, lastPage: number) => {
  const { leftLimit, rightLimit } = calculateLimits(firstPage, currentPage, lastPage);
  const buttonNums = [];

  for (let i = leftLimit; i < rightLimit + 1; i += 1) {
    buttonNums.push(i);
  }
  return buttonNums;
};

const PageNavigator = ({
  firstPage,
  currentPage,
  lastPage,
  onPageChange,
  pageStyles,
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
  const [buttons, changeButtons] = useState([]);
  const [pageNums, setPageNums] = useState([firstPage, currentPage, lastPage]);

  const onArrowClick = (direction: number) => {
    let toAdd;
    if (direction === 1) toAdd = 7;
    else toAdd = -7;

    setPageNums([
      pageNums[0],
      buttons[3] + toAdd, // central button,
      pageNums[2],
    ]);
  };

  useEffect(() => {
    changeButtons(getNewButtonArray(...pageNums));
  }, [pageNums]);

  if (
    Number.isNaN(currentPage) ||
    Number.isNaN(lastPage) ||
    (firstPage == 1 && currentPage === 1 && lastPage === 1)
  )
    return;

  return (
    <View style={styles.containerView}>
      {buttons.at(0) !== firstPage ? (
        <Arrow name="left" onClick={() => onArrowClick(0)} />
      ) : (
        <HiddenView />
      )}

      {buttons.map((number) =>
        currentPage !== number ? (
          <ClickableText
            viewStyle={[styles.button, pageStyles[number]?.view]}
            textStyle={[fontSize.large, pageStyles[number]?.text, globalStyles.textColor]}
            text={number}
            onPress={() => onPageChange(number)}
            key={number}
          />
        ) : (
          <ActiveButton number={number} key={number} />
        )
      )}

      {buttons.at(-1) !== lastPage ? (
        <Arrow name="right" onClick={() => onArrowClick(1)} />
      ) : (
        <HiddenView />
      )}
    </View>
  );
};

export default PageNavigator;
