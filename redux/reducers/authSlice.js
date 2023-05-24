import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isSignedIn: false,
    shouldAutoAuth: false,
  },
  reducers: {
    signIn(state) {
      state.isSignedIn = true;
    },
    signOut(state, action) {
      state.isSignedIn = false;
      state.shouldAutoAuth = action.payload.autoAuth;
    },
  },
});

export default authSlice.reducer;
export const { signIn, signOut } = authSlice.actions;
