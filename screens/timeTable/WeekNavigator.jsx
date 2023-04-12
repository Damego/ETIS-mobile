import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View, Image, StyleSheet } from 'react-native';

import calculateLimits from '../../utils/funcs';

const styles = StyleSheet.create({
  arrow: {
    width: 25,
    height: 25,
  },
  arrowMirror: {
    width: 25,
    height: 25,
    transform: [{ rotateY: '180deg' }],
  },
  weekNavigationView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    paddingHorizontal: '1%',
    paddingBottom: '2%',
    paddingTop: '2%',
  },
  weekButtonView: {
    height: 35,
  },
  weekButtonText: {
    fontSize: 20,
  },
  currentWeekButtonView: {
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
  currentWeekButtonText: {
    marginTop: '10%',
    fontSize: 20,
    color: '#FFFFFF',
  },
});
const WeekNavigation = ({ firstWeek, currentWeek, lastWeek, onWeekChange }) => {
  const [buttons, changeButtons] = useState([]);
  const [isLoaded, setLoaded] = useState(false);
  const [weeks, setWeeks] = useState([firstWeek, currentWeek, lastWeek]);

  const onArrowClick = (direction) => {
    let toAdd;
    if (direction === 1) toAdd = 7;
    else toAdd = -7;

    setWeeks([
      weeks[0],
      buttons[3] + toAdd, // central button,
      weeks[2],
    ]);

    setLoaded(false);
  };

  useEffect(() => {
    const renderNavigation = () => {
      const { leftLimit, rightLimit } = calculateLimits(...weeks);
      const buttonNums = [];

      for (let i = leftLimit; i < rightLimit + 1; i += 1) {
        buttonNums.push(i);
      }
      changeButtons(buttonNums);
    };

    if (isLoaded) return;

    renderNavigation();

    setLoaded(true);
  }, [isLoaded, weeks]);

  return (
    <View style={styles.weekNavigationView}>
      <TouchableOpacity onPress={() => onArrowClick(0)}>
        <Image style={styles.arrow} source={require('../../assets/arrow_week_nav.png')} />
      </TouchableOpacity>

      {
        // TODO: yeet this shit too lol
        buttons.map((i) =>
          currentWeek !== i ? (
            <TouchableOpacity key={i} onPress={() => onWeekChange(i)}>
              <View key={i} style={styles.weekButtonView}>
                <Text style={styles.weekButtonText}>{i}</Text>
              </View>
            </TouchableOpacity>
          ) : (
            <View key={i} style={styles.currentWeekButtonView}>
              <Text style={styles.currentWeekButtonText}>{i}</Text>
            </View>
          )
        )
      }

      <TouchableOpacity onPress={() => onArrowClick(1)}>
        <Image style={styles.arrowMirror} source={require('../../assets/arrow_week_nav.png')} />
      </TouchableOpacity>
    </View>
  );
};

export default WeekNavigation;
