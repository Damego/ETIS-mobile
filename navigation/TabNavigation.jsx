"use strict";

import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import AbsensesPage from "../screens/Absenses";
import MessagesPage from "../screens/Message";
import SignsPage from "../screens/Signs";
import TimeTablePage from "../screens/timeTable/TimeTable";

import { GLOBAL_STYLES } from "../styles/styles";

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    return (
      <Tab.Navigator screenOptions={GLOBAL_STYLES.buttomNavigator}>
        <Tab.Screen
          name="Расписание"
          component={TimeTablePage}
          options={{
            headerShown: false
          }}
        />
        <Tab.Screen
          name="Оценки"
          component={SignsPage}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="Пропуски"
          component={AbsensesPage}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="Сообщения"
          component={MessagesPage}
          options={{ headerShown: false }}
        />
      </Tab.Navigator>
    );
  }


export default TabNavigator;