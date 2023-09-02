import Constants from 'expo-constants';

export const getVersion = () => {
  return Constants.expoConfig?.version;
};
