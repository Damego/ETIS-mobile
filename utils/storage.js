import * as SecureStore from 'expo-secure-store';

export default class Storage {
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
    return {};
  }

  async deleteAccountData() {
    await SecureStore.deleteItemAsync('userLogin');
    await SecureStore.deleteItemAsync('userPassword');
  }
}
