"use strict";

import React, { Component } from "react";
import { createBottomTabNavigator, Image } from "@react-navigation/bottom-tabs";

import AbsensesPage from "./screens/Absenses";
import MessagesPage from "./screens/Message";
import SignsPage from "./screens/Signs";
import TimeTablePage from "./screens/timeTable/TimeTable";

import { GLOBAL_STYLES } from "../utils/styles";

const Tab = createBottomTabNavigator();

export default class TabNavigator extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Tab.Navigator screenOptions={GLOBAL_STYLES.buttomNavigator}>
        <Tab.Screen
          name="Расписание"
          component={TimeTablePage}
          options={{
            headerShown: false,
            tabBarItem: (tabInfo) => (
              <View>
                <Image
                source={require("../assets/tab_icons/timetable.png")} 
                resizeMode="contain"
                />
              </View>
            ),
          }}
          initialParams={this.props}
        />
        <Tab.Screen
          name="Оценки"
          component={SignsPage}
          options={{ headerShown: false }}
          initialParams={this.props}
        />
        <Tab.Screen
          name="Пропуски"
          component={AbsensesPage}
          options={{ headerShown: false }}
          initialParams={this.props.route.params}
        />
        <Tab.Screen
          name="Сообщения"
          component={MessagesPage}
          options={{ headerShown: false }}
          initialParams={this.props.route.params}
        />
      </Tab.Navigator>
    );
  }
}
