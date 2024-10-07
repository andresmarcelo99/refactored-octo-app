import { Chat } from 'src/chat/models/chat.entity';
import { User } from 'src/users/models/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @ManyToOne(() => User, (user) => user.messages)
  @JoinColumn()
  user: User;

  @ManyToOne(() => Chat, (chat) => chat.messages)
  @JoinTable()
  chat: Chat;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
