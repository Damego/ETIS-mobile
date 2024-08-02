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

export enum AccountType {
  NONE,
  AUTHORIZED_STUDENT,
  UNAUTHORIZED_STUDENT,
  UNAUTHORIZED_TEACHER,
}

interface AccountState {
  isSignedIn: boolean;
  isAuthorizing: boolean;
  userCredentials?: UserCredentials;
  saveUserCredentials: boolean;
  fromStorage: boolean;
  isOfflineMode: boolean;
  isSignedOut: boolean;
  isDemo: boolean;
  teacher?: TeacherState;
}

const initialState: AccountState = {
  isSignedIn: false,
  isAuthorizing: false,
  saveUserCredentials: true,
  fromStorage: false,
  isOfflineMode: false,
  isSignedOut: false,
  isDemo: false,
  accountType: AccountType.NONE,
};

const accountSlice = createSlice({
  name: 'account',
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
    },
    setAuthorizing(state, action: PayloadAction<boolean>) {
      state.isAuthorizing = action.payload;
    },
    setUserCredentials(state, action: PayloadAction<SetUserCredentialsPayload>) {
      if (action.payload.userCredentials) {
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
      state.studentGroupId = action.payload;
      state.teacher = null;
      state.accountType = AccountType.UNAUTHORIZED_STUDENT;
      state.studentGroupId = null;
      state.teacher = action.payload;
      state.accountType = AccountType.UNAUTHORIZED_TEACHER;
    },
    clearAccountState(state) {
      state.studentGroupId = null;
      state.teacher = null;
      state.accountType = AccountType.NONE;
    },
  },
});

export default accountSlice.reducer;
export const {
  signIn,
  signOut,
  setAuthorizing,
  setUserCredentials,
  setSaveUserCredentials,
  signInDemo,
  setAccountState,
  setGroupId,
  setTeacher,
  clearAccountState,
} = accountSlice.actions;
