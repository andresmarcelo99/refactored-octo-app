import { Chat } from 'src/chat/models/chat.entity';
import { Message } from 'src/message/models/message.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  OneToMany,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  nickname: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @ManyToMany(() => Chat, (chat) => chat.users)
  chats: Chat[];

  @OneToMany(() => Message, (message) => message.user)
  messages: Message[];
}
