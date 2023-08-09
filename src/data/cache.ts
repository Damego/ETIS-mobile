import { GetResultType, IGetResult } from '../models/results';
import { storage } from '../utils';
import { ITimeTable } from '../models/timeTable';
import { IMessagesData } from '../models/messages';
import { IOrder } from '../models/order';
import { ISessionMarks } from '../models/sessionMarks';
import { StudentInfo } from '../parser/menu';
import { StudentData } from '../models/student';
import { TeacherType } from '../models/teachers';
import { ISessionTeachPlan } from '../models/teachPlan';
import { ISessionRating } from '../models/rating';
import { ISessionPoints } from '../models/sessionPoints';

const toResult = <T>(data: T): IGetResult<T> => ({
  type: GetResultType.cached,
  data,
});

