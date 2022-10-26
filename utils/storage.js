import AsyncStorage from '@react-native-async-storage/async-storage';

export default class Storage {
    async storeSessionID(sessionID) {
        try {
            await AsyncStorage.setItem("sessionID", sessionID);
        } catch (exception) {
            console.warn("Error saving sessionID", e)
        }
    }

    async getSessionID() {
        try {
            return await AsyncStorage.getItem("sessionID");
        } catch (exception) {
            console.warn("Error getting sessionID", e)
        }
    }

    async storeAccountData(login, password) {
        // ! Я думаю, что хранить данные в незащищённом виде это плохо.
        try {
            await AsyncStorage.setItem("userLogin", login);
            await AsyncStorage.setItem("userPassword", password);
        } catch (exception) {
            console.warn("Error saving user data", e)
        }
    }

    async getAccountData() {
        try {
            return {
                login: await AsyncStorage.getItem("userLogin"),
                password: await AsyncStorage.getItem("userPassword"),
            }
        } catch (exception) {
            console.warn("Error getting user data", e)
        }
    }
}