import { View, Text, StyleProp, ViewStyle, LayoutChangeEvent } from "react-native";
import { useGlobalStyles } from "../../hooks";
import styles from "./AbsencesStyles";
import CardHeaderOut from "../../components/CardHeaderOut";
import { IDisciplineAbsences } from "../../models/absences";
import { TouchableOpacity } from "react-native";
import React, { useEffect, useRef, useState } from 'react';
import { AntDesign } from "@expo/vector-icons";

const AbsencesCard = ({disciplineAbsences, style} 
  : {disciplineAbsences: IDisciplineAbsences, style?: StyleProp<ViewStyle>}) => {
  const globalStyles = useGlobalStyles();
  const [isOpened, setOpened] = useState(false);
  const [datesHeight, setDatesHeight] = useState(0);
  const [textHeight, setTextHeight] = useState(0);

  const toggleOpened = () => datesHeight > textHeight ? setOpened(!isOpened) : {};
  
  return (
    <CardHeaderOut topText={disciplineAbsences.subject + ", " + disciplineAbsences.type}>
      <TouchableOpacity
        onPress={toggleOpened}
        style={[styles.dropdownView, style, {flexDirection: 'row', overflow: 'hidden'}]}
        activeOpacity={datesHeight > textHeight ? 0.45 : 1} >
        <View style={{flex: 3}}>
          <View style={ isOpened ? {} : {  position: "absolute", left: 0 } }
            onLayout={(event) => { setDatesHeight(event.nativeEvent.layout.height); }}>
            {disciplineAbsences.dates.map((date: string, index: number) => (
              <Text key={index} style={[globalStyles.textColor, ]}>{date}</Text>
          ))}
          </View>
        </View>
        <View style={{flex: 9}}>
          <View style={{width: '90%'}}
            onLayout={(event) => { setTextHeight(event.nativeEvent.layout.height) }}>
              <Text style={[globalStyles.textColor]}>
                {'Пропущенных занятий: ' + disciplineAbsences.dates.length}
              </Text>
              <Text style={globalStyles.textColor}>
                {'Преподаватель: ' + disciplineAbsences.teacher}
              </Text>
          </View>
        </View>
        {
          datesHeight > textHeight ? 
            <AntDesign 
              name={isOpened ? 'up' : 'down'} 
              size={18} 
              color={globalStyles.textColor.color}
              style={{position: 'absolute', right: 0, bottom: 0}} />
          : <></>
        }
      </TouchableOpacity>
    </CardHeaderOut>
  );
};

export default AbsencesCard;