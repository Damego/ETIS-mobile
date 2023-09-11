import { View, Text, StyleProp, ViewStyle } from "react-native";
import { useGlobalStyles } from "../../hooks";
import styles from "./AbsencesStyles";
import CardHeaderOut from "../../components/CardHeaderOut";
import { IAbsenceDate, IDisciplineAbsences } from "../../models/absences";
import { TouchableOpacity } from "react-native";
import React, { useState } from 'react';
import { AntDesign } from "@expo/vector-icons";

const AbsencesCard = ({disciplineAbsences, style} 
  : {disciplineAbsences: IDisciplineAbsences, style?: StyleProp<ViewStyle>}) => {
  const globalStyles = useGlobalStyles();
  const [isOpened, setOpened] = useState(false);

  return (
    <CardHeaderOut topText={disciplineAbsences.subject}>
      <TouchableOpacity
        onPress={() => setOpened(!isOpened)}
        style={[styles.touchable, style]}
        activeOpacity={0.45} >
        <View style={{flex: 1}}>
          <View style={ isOpened ? {} : {  position: "absolute", left: 0 } }>
            {disciplineAbsences.dates.map((date: IAbsenceDate, index: number) => (
              <Text key={index} 
                style={date.isCovered ? styles.coveredAbsenceColor : styles.uncoveredAbsenceColor}>
                {date.date}
              </Text>
          ))}
          </View>
        </View>
        <View style={{flex: 3}}>
          <View style={{width: '90%'}}>
            <Text style={[globalStyles.textColor]}>
              {'Пропущенных занятий: ' + disciplineAbsences.dates.length}
            </Text>
            <Text style={globalStyles.textColor}>
              {'Из них по уважительной причине: ' + disciplineAbsences.dates.filter(date => date.isCovered).length}
            </Text>
            {isOpened ? 
            <View>
              <Text style={globalStyles.textColor}>
                {'Преподаватель: ' + disciplineAbsences.teacher}
              </Text>
              <Text style={globalStyles.textColor}>
                {'Вид работы: ' + disciplineAbsences.type}
              </Text> 
            </View>
            : <></>}
          </View>
        </View>
        <AntDesign 
          name={isOpened ? 'up' : 'down'} 
          size={18} 
          color={globalStyles.textColor.color}
          style={{position: 'absolute', right: 0, bottom: 0}} />
      </TouchableOpacity>
    </CardHeaderOut>
  );
};

export default AbsencesCard;