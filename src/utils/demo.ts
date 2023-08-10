import { UserCredentials } from '../redux/reducers/authSlice';

export const isDemoCredentials = (userCredentials: UserCredentials) => {
  return userCredentials.login === 'demo';
};
