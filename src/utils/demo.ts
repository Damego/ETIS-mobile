import { UserCredentials } from '../redux/reducers/authSlice';

const isDemoCredentials = (userCredentials: UserCredentials) => userCredentials.login === 'demo';

export default isDemoCredentials;
