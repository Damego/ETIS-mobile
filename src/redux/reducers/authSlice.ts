import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface UserCredentials {
  login: string;
  password: string;
}

interface AuthState {
  isSignedIn: boolean;
  isAuthorizing: boolean;
  userCredentials?: UserCredentials;
  saveUserCredentials: boolean;
}

const initialState: AuthState = {
  isSignedIn: false,
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
    signOut(state) {
      state.isSignedIn = false;
      state.userCredentials = undefined;
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