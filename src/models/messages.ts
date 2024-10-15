import { IFile } from '~/models/other';

export enum MessageType {
  message = 'message',
  studentReply = 'studentReply',
  teacherReply = 'teacherReply',
}

export interface IMessage {
  type: MessageType;
  time: string;
  author?: string;
  content: string;
  files?: IFile[];
  answerMessageID?: string;
  subject?: string;
  theme?: string;
  answerID?: string;
  messageID?: string;
}

export interface IMessagesData {
  messages: IMessage[][];
  page: number;
  lastPage: number;
}
