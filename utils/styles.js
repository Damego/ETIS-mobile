import { StyleSheet } from "react-native";

export const GLOBAL_STYLES = StyleSheet.create({
  loadingDataView: {},
  loadingDataText: {},
  headerContainer: {
    height: "10%",
    backgroundColor: "#C62E3E",
  },
  headerText: {
    paddingTop: "3%",
    fontSize: 19,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  timeTableDay: {
    width: "90%",
    backgroundColor: "#ffffff",
    marginLeft: "5%",
    marginTop: "3%",
    borderRadius: 10,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.35,
    shadowRadius: 6,
  },
  timeTableDate: {
    fontSize: 20,
    fontWeight: "400",
  },
  lessonContainer: {
    display: "flex",
  },
  lessonTimeView: {},
  lessonTimeText: {
    fontSize: 18,
  },
  lessonInfoView: {},
  lessonInfoText: {},
  lessonTeacherView: {},
  lessonTeacherText: {},
});
