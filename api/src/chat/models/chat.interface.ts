import { UserI } from 'src/users/models/user.interface';

export interface ChatI {
  id?: number;
  name?: string;
  description?: string;
  users?: UserI[];
  created_at?: Date;
  updated_at?: Date;
}
