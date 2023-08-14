import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { StudentData, StudentState } from '../../models/student';
import { StudentInfo } from '../../parser/menu';

const initialState: StudentState = {
  info: null,
  messageCount: null,
  announceCount: null,
  sessionTestID: null,
};

const studentSlice = createSlice({
  name: 'student',
  initialState: initialState,
  reducers: {
    setStudentState(state, action: PayloadAction<StudentInfo>) {
      state.info = action.payload.student;
      state.sessionTestID = action.payload.sessionTestID;
      state.announceCount = action.payload.announceCount;
      state.messageCount = action.payload.messageCount;
    },
    setStudentInfo(state, action: PayloadAction<StudentData>) {
      state.info = action.payload;
    },
    setMessageCount(state, action: PayloadAction<number>) {
      state.messageCount = action.payload;
    },
    setAnnounceCount(state, action: PayloadAction<number>) {
      state.announceCount = action.payload;
    },
    setSessionTestID(state, action: PayloadAction<string>) {
      state.sessionTestID = action.payload;
    },
  },
});

export default studentSlice.reducer;
export const { setStudentState, setStudentInfo, setMessageCount, setAnnounceCount } =
  studentSlice.actions;
