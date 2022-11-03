"use strict";


import React, { Component } from "react";
import { View } from "react-native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import AbsensesPage from "./screens/Absenses";
import MessagesPage from "./screens/Message";
import SignsPage from "./screens/Signs";
import TimeTablePage from "./screens/TimeTable";

const Tab = createBottomTabNavigator();

export default class TabNavigator extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <Tab.Navigator>
                <Tab.Screen name="Расписание" component={TimeTablePage} options={{ headerShown: false }} />
                <Tab.Screen name="Оценки" component={SignsPage} options={{ headerShown: false }} />
                <Tab.Screen name="Пропуски" component={AbsensesPage} options={{ headerShown: false }} />
                <Tab.Screen name="Сообщения" component={MessagesPage} options={{ headerShown: false }} />
            </Tab.Navigator>
        )
    }

}