import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './models/user.entity';
import { Chat } from 'src/chat/models/chat.entity';
import { Message } from 'src/message/models/message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Chat, Message])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
