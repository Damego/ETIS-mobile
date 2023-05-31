import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface UserCredentials {
  login: string;
  password: string;
}

interface AuthState {
  isSignedIn: boolean;
  shouldAutoAuth: boolean;
  isAuthorizing: boolean;
  userCredentials?: UserCredentials;
  saveUserCredentials: boolean;
}

const initialState: AuthState = {
  isSignedIn: false,
  shouldAutoAuth: false,
  isAuthorizing: false,
  saveUserCredentials: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signIn(state) {
      state.isSignedIn = true;
    },
    signOut(state, action) {
      state.isSignedIn = false;
      state.shouldAutoAuth = action.payload.autoAuth;
    },
    setAuthorizing(state, action: PayloadAction<boolean>) {
      state.isAuthorizing = action.payload;
    },
    setUserCredentials(state, action: PayloadAction<UserCredentials>) {
      state.userCredentials = action.payload;
    },
    setSaveUserCredentials(state, action: PayloadAction<boolean>) {
      state.saveUserCredentials = action.payload
    }
  },
});

export default authSlice.reducer;
export const { signIn, signOut, setAuthorizing, setUserCredentials } = authSlice.actions;
