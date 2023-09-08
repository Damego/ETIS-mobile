import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { IPersonalRecord } from '../../models/personalRecords';
import { StudentData, StudentState } from '../../models/student';
import { StudentInfo } from '../../parser/menu';

const initialState: StudentState = {
  info: null,
  messageCount: null,
  announceCount: null,
  sessionTestID: null,
  currentSession: null,
  currentWeek: null,
  personalRecords: null,
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
    setCurrentWeek(state, action: PayloadAction<number>) {
      state.currentWeek = action.payload;
    },
    setCurrentSession(state, action: PayloadAction<number>) {
      state.currentSession = action.payload;
    },
    setPersonalRecords(state, action: PayloadAction<IPersonalRecord[]>) {
      state.personalRecords = action.payload;
    },
    resetForRecord(state) {
      state.info = null;
      state.messageCount = null;
      state.announceCount = null;
      state.sessionTestID = null;
      state.currentSession = null;
      state.currentWeek = null;
    },
  },
});

export default studentSlice.reducer;
export const {
  setStudentState,
  setStudentInfo,
  setMessageCount,
  setAnnounceCount,
  setCurrentWeek,
  setCurrentSession,
  setPersonalRecords,
  resetForRecord,
} = studentSlice.actions;
