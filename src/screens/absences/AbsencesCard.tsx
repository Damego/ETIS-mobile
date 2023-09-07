import { View, Text } from "react-native";
import { useGlobalStyles } from "../../hooks";
import styles from "./AbsencesStyles";
import CardHeaderOut from "../../components/CardHeaderOut";
import { IDisciplineAbsences } from "../../models/absences";
import { TouchableOpacity } from "react-native";
import { useState } from "react";
import { AntDesign } from "@expo/vector-icons";

const AbsencesCard = ({disciplineAbsences} : {disciplineAbsences: IDisciplineAbsences}) => {
  const globalStyles = useGlobalStyles();
  const [isOpened, setOpened] = useState(false);
  
  return (
    <CardHeaderOut topText={disciplineAbsences.subject + ", " + disciplineAbsences.type}>
      <TouchableOpacity
        onPress={() => setOpened(!isOpened)}
        style={styles.dropdownView}
        activeOpacity={0.45} >
        <View>
          <Text style={globalStyles.textColor}>
            {'Пропущенных занятий по дисциплине: ' + disciplineAbsences.dates.length}
          </Text>
          <Text style={globalStyles.textColor}>
            {'Преподаватель: ' + disciplineAbsences.teacher}
          </Text>
        </View>
        <AntDesign 
          name={isOpened ? 'up' : 'down'} 
          size={18} 
          color={globalStyles.textColor.color}
          style={styles.leftMargin} />
      </TouchableOpacity>

      {isOpened && (
        <View>
          {disciplineAbsences.dates.map((date: string, index: number) => (
            <Text key={index} style={globalStyles.textColor}>{date}</Text>
          ))}
        </View>
      )}
    </CardHeaderOut>
  );
};

export default AbsencesCard;