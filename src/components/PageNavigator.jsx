import { AntDesign } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useGlobalStyles } from '../hooks';
import ClickableText from './ClickableText';

const styles = StyleSheet.create({
  containerView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1%',
  },
  button: {
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clickableText: {
    fontSize: 20,
  },
  activeButtonView: {
    borderRadius: 10,
  },
  activeButtonText: {
    fontSize: 20,
    color: '#FFFFFF',
  },
});

const Arrow = ({ onClick, name }) => {
  const {
    colors: { primary },
  } = useTheme();

  return (
    <TouchableOpacity style={styles.button} onPress={onClick}>
      <AntDesign name={name} size={20} color={primary} />
    </TouchableOpacity>
  );
};

const ActiveButton = ({ number }) => {
  const globalStyles = useGlobalStyles();

  return (
    <View style={[styles.button, styles.activeButtonView, globalStyles.primaryBackgroundColor]}>
      <Text style={styles.activeButtonText}>{number}</Text>
    </View>
  );
};

const HiddenView = () => <View style={styles.button}></View>;

const calculateLimits = (firstPage, currentPage, lastPage) => {
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

const getNewButtonArray = (firstPage, currentPage, lastPage) => {
  const { leftLimit, rightLimit } = calculateLimits(firstPage, currentPage, lastPage);
  const buttonNums = [];

  for (let i = leftLimit; i < rightLimit + 1; i += 1) {
    buttonNums.push(i);
  }
  return buttonNums;
};

const PageNavigator = ({ firstPage, currentPage, lastPage, onPageChange }) => {
  const globalStyles = useGlobalStyles();
  const [buttons, changeButtons] = useState([]);
  const [pageNums, setPageNums] = useState([firstPage, currentPage, lastPage]);

  const onArrowClick = (direction) => {
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
            viewStyle={[styles.button]}
            textStyle={[styles.clickableText, globalStyles.textColor]}
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
