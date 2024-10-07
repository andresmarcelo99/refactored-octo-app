import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './models/chat.entity';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { MessageService } from 'src/message/message.service';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/models/user.entity';
import { Message } from 'src/message/models/message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Chat, User, Message])],
  controllers: [ChatController],
  providers: [ChatService, UsersService, MessageService],
  exports: [ChatService],
})
export class ChatModule {}
