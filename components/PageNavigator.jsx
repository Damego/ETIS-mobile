import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import calculateLimits from '../utils/funcs';

const styles = StyleSheet.create({
  arrow: {
    width: 25,
    height: 25,
  },
  mirrored: {
    transform: [{ rotateY: '180deg' }],
  },
  containerView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    paddingHorizontal: '1%',
    paddingBottom: '2%',
    paddingTop: '2%',
  },
  clickableButtonView: {
    height: 35,
  },
  clickableButtonText: {
    fontSize: 20,
  },
  activeButtonView: {
    alignItems: 'center',
    width: 35,
    height: 35,
    backgroundColor: '#C62E3E',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 4,
  },
  activeButtonText: {
    marginTop: '10%',
    fontSize: 20,
    color: '#FFFFFF',
  },
});

const Arrow = ({ onClick, isMirrored }) => {
  const style = [styles.arrow];
  if (isMirrored) style.push(styles.mirrored);

  return (
    <TouchableOpacity onPress={onClick}>
      <Image style={style} source={require('../assets/arrow_week_nav.png')} />
    </TouchableOpacity>
  );
};

const Button = ({ number, onClick }) => (
  <TouchableOpacity onPress={() => onClick(number)}>
    <View style={styles.clickableButtonView}>
      <Text style={styles.clickableButtonText}>{number}</Text>
    </View>
  </TouchableOpacity>
);

const ActiveButton = ({ number }) => (
  <View style={styles.activeButtonView}>
    <Text style={styles.activeButtonText}>{number}</Text>
  </View>
);

const PageNavigator = ({ firstPage, currentPage, lastPage, onPageChange }) => {
  const [buttons, changeButtons] = useState([]);
  const [isLoaded, setLoaded] = useState(false);
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

    setLoaded(false);
  };

  useEffect(() => {
    const renderNavigation = () => {
      const { leftLimit, rightLimit } = calculateLimits(...pageNums);
      const buttonNums = [];

      for (let i = leftLimit; i < rightLimit + 1; i += 1) {
        buttonNums.push(i);
      }
      changeButtons(buttonNums);
    };

    if (isLoaded) return;

    renderNavigation();

    setLoaded(true);
  }, [isLoaded, pageNums]);

  return (
    <View style={styles.containerView}>
      <Arrow onClick={() => onArrowClick(0)} />

      {buttons.map((number) =>
        currentPage !== number ? (
          <Button number={number} onClick={onPageChange} key={number}/>
        ) : (
          <ActiveButton number={number} key={number}/>
        )
      )}

      <Arrow isMirrored onClick={() => onArrowClick(1)} />
    </View>
  );
};

export default PageNavigator;
