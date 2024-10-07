import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './models/message.entity';
import { MessageI } from './models/message.interface';
import { ChatI } from 'src/chat/models/chat.interface';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async create(message: MessageI): Promise<MessageI> {
    return this.messageRepository.save(this.messageRepository.create(message));
  }

  async findMessagesForChat(chatId: number): Promise<MessageI[]> {
    console.log('id', chatId);
    return this.messageRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.chat', 'chat')
      .where('chat.id = :chatId', { chatId })
      .leftJoinAndSelect('message.user', 'user')
      .orderBy('message.created_at', 'DESC')
      .getMany();
  }
}
