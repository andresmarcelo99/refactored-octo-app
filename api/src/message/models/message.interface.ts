import { ChatI } from 'src/chat/models/chat.interface';
import { UserI } from 'src/users/models/user.interface';

export interface MessageI {
  id?: number;
  text: string;
  user: UserI;
  chat: ChatI;
  created_at: Date;
  updated_at: Date;
}
