import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface UserCredentials {
  login: string;
  password: string;
}

export interface SetUserCredentialsPayload {
  userCredentials: UserCredentials;
  fromStorage: boolean;
}

export interface SignInPayload {
  isOffline?: boolean;
}

export interface SignOutPayload {
  cleanUserCredentials?: boolean;
}

interface AuthState {
  isSignedIn: boolean;
  isAuthorizing: boolean;
  userCredentials?: UserCredentials;
  saveUserCredentials: boolean;
  fromStorage: boolean;
  isOfflineMode: boolean;
  isSignedOut: boolean;
  isDemo: boolean;
}

const initialState: AuthState = {
  isSignedIn: false,
  isAuthorizing: false,
  saveUserCredentials: true,
  fromStorage: false,
  isOfflineMode: false,
  isSignedOut: false,
  isDemo: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signIn(state, action: PayloadAction<SignInPayload>) {
      state.isSignedIn = true;
      state.isSignedOut = false;
      state.isDemo = false;
      if (action && action.payload.isOffline !== undefined) {
        state.isOfflineMode = action.payload.isOffline;
      }
    },
    signOut(state, action: PayloadAction<SignOutPayload>) {
      state.isSignedIn = false;
      state.isSignedOut = true;
      state.isDemo = false;
      if (action.payload.cleanUserCredentials) state.userCredentials = undefined;
    },
    setAuthorizing(state, action: PayloadAction<boolean>) {
      state.isAuthorizing = action.payload;
    },
    setUserCredentials(state, action: PayloadAction<SetUserCredentialsPayload>) {
      state.userCredentials = action.payload.userCredentials;
      state.fromStorage = action.payload.fromStorage;
    },
    setSaveUserCredentials(state, action: PayloadAction<boolean>) {
      state.saveUserCredentials = action.payload;
    },
    signInDemo(state, action: PayloadAction<boolean>) {
      state.isSignedIn = true;
      state.isSignedOut = false;
      state.isDemo = action.payload;
    },
  },
});

export default authSlice.reducer;
export const {
  signIn,
  signOut,
  setAuthorizing,
  setUserCredentials,
  setSaveUserCredentials,
  signInDemo,
} = authSlice.actions;
