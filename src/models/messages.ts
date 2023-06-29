import { IGetPayload } from './results';

export enum MessageType {
  message = 'message',
  studentReply = 'studentReply',
  teacherReply = 'teacherReply',
}

export interface IMessageFile {
  name: string;
  uri: string;
}

export interface IMessage {
  type: MessageType;
  time: string;
  author?: string;
  content: string;
  files?: IMessageFile[];
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

export interface IGetMessagesPayload extends IGetPayload {
  page: number;
}