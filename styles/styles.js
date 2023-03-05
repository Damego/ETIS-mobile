import { StyleSheet } from "react-native";

export const GLOBAL_STYLES = StyleSheet.create({
  screen: {
    backgroundColor: "#F8F8FA",
    height: "100%",
  },
  buttomNavigator: {
    tabBarStyle: { zIndex: 1 },
  },
  loadingDataText: {
    fontSize: 30,
  },
  headerContainer: {
    display: "flex",
    marginLeft: "5%",
    paddingTop: "2%",
    paddingBottom: "2%",
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

    paddingHorizontal: "1%",
  },
  lessonTimeView: {
    paddingHorizontal: 1,
  },
  lessonTimeText: {
    fontSize: 14,
  },
  lessonInfoView: {},
  lessonInfoText: {
    fontSize: 16,
    fontWeight: "500",
  },
  lessonAudienceText: {
    color: "#353535",
  },
  weekNavigationView: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    paddingHorizontal: "1%",
    height: "8%"
  },
  navigaionArrowView: {},
  navigaionArrowText: {
    color: "#C62E3E",
    fontSize: 40,
  },
  weekButtonView: {},
  weekButtonText: {
    fontSize: 20,
  },
  currentWeekButtonView: {
    alignItems: "center",
    width: 35,
    height: 35,
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
    marginTop: "6%",
    fontSize: 20,
    color: "#FFFFFF",
  },
});
