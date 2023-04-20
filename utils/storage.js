import * as SecureStore from 'expo-secure-store';

export default class Storage {
  async storeSessionID(sessionID) {
    try {
      await SecureStore.setItemAsync('sessionID', sessionID);
    } catch (exception) {
      console.warn('Error saving sessionID', e);
    }
  }

  async getSessionID() {
    try {
      return await SecureStore.getItemAsync('sessionID');
    } catch (exception) {
      console.warn('Error getting sessionID', e);
    }
  }

  async storeAccountData(login, password) {
    try {
      await SecureStore.setItemAsync('userLogin', login);
      await SecureStore.setItemAsync('userPassword', password);
    } catch (exception) {
      console.warn('Error saving user data', e);
    }
  }

  async getAccountData() {
    try {
      return {
        login: await SecureStore.getItemAsync('userLogin'),
        password: await SecureStore.getItemAsync('userPassword'),
      };
    } catch (exception) {
      console.warn('Error getting user data', e);
    }
    return {}
  }
}
