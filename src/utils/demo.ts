import { UserCredentials } from '../redux/reducers/accountSlice';

const isDemoCredentials = (userCredentials: UserCredentials) => userCredentials.login === 'demo';

export default isDemoCredentials;
