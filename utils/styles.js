import { StyleSheet } from "react-native";

export const GLOBAL_STYLES = StyleSheet.create({
  loadingDataView: {},
  loadingDataText: {},
  headerContainer: {
    height: "7%",
    backgroundColor: "#C62E3E",
    display: "flex",
    alignItems: "center",
  },
  headerText: {
    fontSize: 19,
    color: "white",
    fontWeight: "bold",
  },
  timeTableDayView: {
    flex: 1,
    display: "flex",
    width: "96%",
    backgroundColor: "#ffffff",
    marginLeft: "2%",
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
  timeTableDateView: {
    marginLeft: "1%",
  },
  timeTableDateText: {
    fontSize: 18,
    fontWeight: "400",
  },
  lessonContainer: {
    marginLeft: "1%",
    display: "flex",
    marginTop: "1%",
    marginBottom: "1%",
    flex: 1,
    flexWrap: "wrap",
    flexShrink: 1,
  },
  lessonTimeView: {
    marginRight: "1%",
  },
  lessonTimeText: {
    fontSize: 16,
  },
  lessonInfoView: {},
  lessonInfoText: {},
});
