import { View, Text } from "react-native";
import Card from "../../components/Card";
import { useGlobalStyles } from "../../hooks";
import { styles } from "./AbsencesRow";

const AbsencesHeader = () => {
  const globalStyles = useGlobalStyles();
  
  return (
    <DataTable.Header>
        <DataTable.Title>{}</DataTable.Title>
        <DataTable.Title>
            <Text style={globalStyles.textColor}>{'Дата занятия'}</Text>
        </DataTable.Title>
        <DataTable.Title>
            <Text style={globalStyles.textColor}>{'Дисциплина'}</Text>
        </DataTable.Title>
    </DataTable.Header>
  );
};

export default AbsencesHeader;