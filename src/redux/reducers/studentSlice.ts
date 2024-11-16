import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { StudentData, StudentState } from '~/models/student';
import { StudentInfo } from '~/parser/menu';

const initialState: StudentState = {
  info: null,
  messageCount: null,
  announceCount: null,
  sessionTestID: null,
  currentSession: null,
  currentWeek: null,
  hasUnverifiedEmail: false,
  iCalToken: null,
};

const studentSlice = createSlice({
  name: 'student',
  initialState,
  reducers: {
    setStudentState(state, action: PayloadAction<StudentInfo>) {
      state.info = action.payload.student;
      state.sessionTestID = action.payload.sessionTestID;
      state.announceCount = action.payload.announceCount;
      state.messageCount = action.payload.messageCount;
      state.hasUnverifiedEmail = action.payload.hasUnverifiedEmail;
      state.currentSession = action.payload.currentSession;
      state.currentWeek = action.payload.currentWeek;
      state.iCalToken = action.payload.iCalToken;
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
    resetForRecord(state) {
      state.info = null;
      state.messageCount = null;
      state.announceCount = null;
      state.sessionTestID = null;
      state.currentSession = null;
      state.currentWeek = null;
    },
    setICalToken(state, action: PayloadAction<string>) {
      state.iCalToken = action.payload;
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
  resetForRecord,
  setICalToken,
} = studentSlice.actions;
