import * as SecureStore from 'expo-secure-store';

export default class Storage {
  async bumpReviewRequest() {
    const reviewStep = await SecureStore.getItemAsync('reviewStep');
    if (reviewStep === null) {
      // первый запуск
      await SecureStore.setItemAsync('reviewStep', 'first-login');
    } else if (reviewStep === 'first-login') {
      // второй запуск - предложить отставить отзыв
      return true;
    }
    return false;
  }

  async setReviewSubmitted() {
    await SecureStore.setItemAsync('reviewStep', 'stop');
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
    return {};
  }

  async deleteAccountData() {
    await SecureStore.deleteItemAsync('userLogin');
    await SecureStore.deleteItemAsync('userPassword');
    await SecureStore.deleteItemAsync('reviewStep');
  }

  hasAcceptedPrivacyPolicy() {
    return SecureStore.getItemAsync('hasAcceptedPrivacyPolicy');
  }

  async acceptPrivacyPolicy() {
    await SecureStore.setItemAsync('hasAcceptedPrivacyPolicy', 'true');
  }
}
