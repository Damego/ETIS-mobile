import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface UserCredentials {
  login: string;
  password: string;
}

export interface setUserCredentialsPayload {
  userCredentials: UserCredentials;
  fromStorage: boolean
}

export interface SignInPayload {
  isOffline?: boolean;
}

interface AuthState {
  isSignedIn: boolean;
  isAuthorizing: boolean;
  userCredentials?: UserCredentials;
  saveUserCredentials: boolean;
  fromStorage: boolean;
  isOfflineMode: boolean;
}

const initialState: AuthState = {
  isSignedIn: false,
  isAuthorizing: false,
  saveUserCredentials: true,
  fromStorage: false,
  isOfflineMode: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signIn(state, action: PayloadAction<SignInPayload>) {
      state.isSignedIn = true;
      if (action && action.payload.isOffline !== undefined) {
        state.isOfflineMode = action.payload.isOffline;
      }
    },
    signOut(state) {
      state.isSignedIn = false;
      state.userCredentials = undefined;
    },
    setAuthorizing(state, action: PayloadAction<boolean>) {
      state.isAuthorizing = action.payload;
    },
    setUserCredentials(state, action: PayloadAction<setUserCredentialsPayload>) {
      state.userCredentials = action.payload.userCredentials;
      state.fromStorage = action.payload.fromStorage;
    },
    setSaveUserCredentials(state, action: PayloadAction<boolean>) {
      state.saveUserCredentials = action.payload;
    },
  },
});

export default authSlice.reducer;
export const { signIn, signOut, setAuthorizing, setUserCredentials, setSaveUserCredentials } = authSlice.actions;
