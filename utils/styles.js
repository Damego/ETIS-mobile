import { StyleSheet } from "react-native";

export const GLOBAL_STYLES = StyleSheet.create({
  loadingDataView: {},
  loadingDataText: {},
  headerContainer: {
    height: "7%",
    display: "flex",
  },
  headerText: {
    fontSize: 26,
    color: "#C62E3E",
    fontWeight: "700",
  },
  timeTableDayView: {
    flex: 1,
    display: "flex",
    width: "96%",
    backgroundColor: "#ffffff",
    marginLeft: "2%",
    marginBottom: "3%",
    borderRadius: 10,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 4,
  },
  timeTableDateView: {
    marginLeft: "2%",
    marginBottom: 4,
  },
  timeTableDateText: {
    fontSize: 16,
    fontWeight: "600",
  },
  lessonContainer: {
    marginLeft: "1%",
    display: "flex",
    marginTop: "1%",
    marginBottom: "1%",
    flexWrap: "wrap",
    flexShrink: 1,
    flexDirection: "row",
  },
  lessonTimeView: {
    marginRight: "1%",
    paddingHorizontal: 1,
  },
  lessonTimeText: {
    fontSize: 13,
  },
  lessonInfoView: {},
  lessonInfoText: {
    fontSize: 14,
    fontWeight: "500",
  },
  lessonAudienceText: {
    color: "#353535",
  },
  weekNavigationView: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  navigaionArrowView: {},
  navigaionArrowText: {
    color: "#C62E3E",
    fontSize: 40,
  },
  weekButtonView: {
    marginHorizontal: 5,
    padding: 5,
  },
  weekButtonText: {
    fontSize: 20,
  },
  currentWeekButtonView: {
    backgroundColor: "#C62E3E",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 4,
  },
  currentWeekButtonText: {
    color: "#FFFFFF",
  },
});
