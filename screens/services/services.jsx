import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native'

import Screen from '../../components/Screen';
import UserInfo from './UserInfo';
import Menu from './Menu'
import {httpClient, parser} from '../../utils';

const Services = () => {
  const [userDataLoaded, setUserDataLoaded] = useState(parser.hasUserData)

  useEffect(() => {
    const wrapper = async () => {
      if (!userDataLoaded) {
        const html = await httpClient.getGroupJournal();
        if (!html) return;
        parser.parseMenu(html, true);
        setUserDataLoaded(true)
      }
    }
    wrapper()
  }, [])

  return (
    <Screen headerText="Сервисы">
      <View style={{flex: 1}}>
        <Text>Профиль</Text>
        <UserInfo data={parser.userData}/>
      </View>

      <View style={{flex: 10}}>
        <Text>Сервисы</Text>
        <Menu />
      </View>
    </Screen>
  )
}

export default Services;