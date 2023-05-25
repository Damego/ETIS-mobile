import React, {useCallback, useState} from 'react';
import { View, Text} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../hooks';
import Dropdown from '../../components/Dropdown';
import { ThemeType, changeTheme } from '../../redux/reducers/settingsSlice';

const options = [
    {
        label: 'Автоматическая',
        value: ThemeType.auto
    },
    {
        label: 'Светлая',
        value: ThemeType.light
    },
    {
        label: 'Тёмная',
        value: ThemeType.dark
    }
]

const ToggleThemeSetting = () => {
    const dispatch = useAppDispatch();
    const theme = useAppSelector(state => state.settings.theme);

    const changeAppTheme = (selectedTheme) => {
        dispatch(changeTheme(selectedTheme));
    }

    return (
        <View style={{flexDirection: 'row'}}>
            <Text>Тема</Text>
            <Dropdown options={options} selectedOption={options.find(option => option.value === theme)} onSelect={changeAppTheme}/>
        </View>
    )
}


export default function Settings() {

    return (
        <View style={{marginTop: '10%'}}>
            <ToggleThemeSetting />
        </View>
    )
}