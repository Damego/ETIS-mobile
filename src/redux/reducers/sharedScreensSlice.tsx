import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { IAvailableCertificate } from '~/models/certificate';
import { IMessage } from '~/models/messages';
import { ITeachPlanDiscipline } from '~/models/teachPlan';
import { IAudience, ILesson } from '~/models/timeTable';

/*
expo-router не позволяет передавать данные между экранами, кроме url параметров,
что заставляет использовать глобальное состояние и увеличивать код
*/

interface IDisciplineInfoScreenPayload {
  lesson: ILesson;
  pairPosition: number;
  date: string; // ISO
}

interface IRequestCertificateScreenPayload {
  availableCertificates: IAvailableCertificate[];
}

interface IDisciplineEducationalComplexScreenPayload {
  disciplineTeachPlan: ITeachPlanDiscipline;
  period: number;
}

interface ISelectGroupScreenPayload {
  facultyId: number;
}

interface IAudienceTimetableScreenPayload {
  audience: IAudience;
}

interface ISessionQuestionnaireScreenPayload {
  url: string;
}

interface IMessageHistoryScreenPayload {
  data: IMessage[];
  page: number;
}

interface ICathedraTimetableScreenPayload {
  teacherId?: number;
  cathedraId?: number;
}

interface IDisciplineTasksScreenPayload {
  taskId?: string;
}

interface SharedScreensSlice {
  disciplineInfo?: IDisciplineInfoScreenPayload;
  requestCertificate?: IRequestCertificateScreenPayload;
  disciplineEducationalComplex?: IDisciplineEducationalComplexScreenPayload;
  selectGroup?: ISelectGroupScreenPayload;
  audienceTimetable?: IAudienceTimetableScreenPayload;
  sessionQuestionnaire?: ISessionQuestionnaireScreenPayload;
  messageHistory?: IMessageHistoryScreenPayload;
  cathedraTimetable?: ICathedraTimetableScreenPayload;
  disciplineTasks?: IDisciplineTasksScreenPayload;
}

const initialState: SharedScreensSlice = {
  disciplineInfo: null,
  requestCertificate: null,
  disciplineEducationalComplex: null,
  selectGroup: null,
  audienceTimetable: null,
  sessionQuestionnaire: null,
  messageHistory: null,
  cathedraTimetable: null,
  disciplineTasks: null,
};

const sharedScreensSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    // Максимально лень писать +100500 функций, ну серьёзно, делать же мне нефиг
    setSharedScreenData(state, action: PayloadAction<SharedScreensSlice>) {
      Object.entries(action.payload).forEach(([key, value]) => {
        state[key] = value;
      });
    },
    setDisciplineInfoData(state, action: PayloadAction<IDisciplineInfoScreenPayload>) {
      state.disciplineInfo = action.payload;
    },
    setRequestCertificate(state, action: PayloadAction<IRequestCertificateScreenPayload>) {
      state.requestCertificate = action.payload;
    },
  },
});

export default sharedScreensSlice.reducer;
export const { setSharedScreenData, setDisciplineInfoData, setRequestCertificate } =
  sharedScreensSlice.actions;
