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
    await SecureStore.setItemAsync('userLogin', login);
    await SecureStore.setItemAsync('userPassword', password);
  }

  async getAccountData() {
    return {
      login: await SecureStore.getItemAsync('userLogin'),
      password: await SecureStore.getItemAsync('userPassword'),
    };
  }

  async deleteAccountData() {
    await SecureStore.deleteItemAsync('userLogin');
    await SecureStore.deleteItemAsync('userPassword');
  }

  hasAcceptedPrivacyPolicy() {
    return SecureStore.getItemAsync('hasAcceptedPrivacyPolicy');
  }

  async acceptPrivacyPolicy() {
    await SecureStore.setItemAsync('hasAcceptedPrivacyPolicy', 'true');
  }

  async getTimeTableData(week) {
    let stringData;
    if (week === undefined) {
      stringData = await SecureStore.getItemAsync('timetable-current');
    } else stringData = await SecureStore.getItemAsync(`timetable-${week}`);

    return JSON.parse(stringData);
  }

  async storeTimeTableData(data, week) {
    const stringData = JSON.stringify(data);

    if (week === undefined) {
      await SecureStore.setItemAsync('timetable-current', stringData);
    } else await SecureStore.setItemAsync(`timetable-${week}`, stringData);
  }
}
