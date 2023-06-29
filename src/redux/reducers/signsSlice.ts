import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { ISessionMarks } from '../../models/sessionMarks';

interface SignsState {
  sessionsMarks: ISessionMarks[];
  fetchedLatestSession: boolean;
}

const initialState: SignsState = {
  sessionsMarks: [],
  fetchedLatestSession: false,
};

const signsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setMarks(state, action: PayloadAction<ISessionMarks[]>) {
      state.sessionsMarks = action.payload;
    },
    setFetchedLatestSession(state, action: PayloadAction<boolean>) {
      state.fetchedLatestSession = action.payload;
    },
  },
});

export default signsSlice.reducer;
export const { setMarks, setFetchedLatestSession } = signsSlice.actions;
