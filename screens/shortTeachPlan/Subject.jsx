import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Subject = ({ data }) => {
  return (
    <View>
        <View style={styles.subjectNameView}>
            <Text style={styles.subjectNameText}>{data.subject}</Text>
        </View>

        <View style={styles.subjectInfoView}>
            <Text style={styles.subjectInfoText}>{data.reporting}</Text>
            <Text style={styles.subjectInfoText}>{`Аудит.часы: ${data.classWork}`}</Text>
            <Text style={styles.subjectInfoText}>{`Сам.часы: ${data.soloWork}`}</Text>
            <Text style={styles.subjectInfoText}>{`Всего: ${data.total}`}</Text>
        </View>
    </View>
  );
};

export default Subject;


const styles = StyleSheet.create({
    subjectNameView: {
        marginLeft: "1%",
        display: "flex",
        marginTop: "1%",
        marginBottom: "1%",
        flexShrink: 1,

        paddingHorizontal: "1%",
    },
    subjectNameText: {
        fontSize: 16,
        fontWeight: "400"
    },
    subjectInfoView: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around"
    },
    subjectInfoText: {
        fontSize: 13,
        color: "#323232",

    }
})