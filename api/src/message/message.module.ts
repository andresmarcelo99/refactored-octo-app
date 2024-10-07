import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './models/message.entity';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { Chat } from 'src/chat/models/chat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Message, Chat])],
  providers: [MessageService],
  exports: [MessageService],
  controllers: [MessageController],
})
export class MessageModule {}
