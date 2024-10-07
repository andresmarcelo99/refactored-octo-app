import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './models/chat.entity';
import { Repository } from 'typeorm';
import { UserI } from 'src/users/models/user.interface';
import { ChatI } from './models/chat.interface';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
  ) {}

  async createChat(chat: ChatI, creator: UserI): Promise<ChatI> {
    if (!chat.users) {
      chat.users = [creator];
    } else {
      chat.users!.push(creator);
    }
    return this.chatRepository.save(chat);
  }

  async getChat(chatId: number): Promise<ChatI> {
    const chat = await this.chatRepository.findOne({
      where: { id: chatId },
      relations: ['users'],
    });

    if (chat) {
      return chat;
    }

    throw new NotFoundException('Chat not found');
  }

  async getChatsForUser(userId: number): Promise<ChatI[]> {
    return this.chatRepository
      .createQueryBuilder('room')
      .leftJoin('room.users', 'users')
      .where('users.id = :userId', { userId })
      .leftJoinAndSelect('room.users', 'all_users')
      .orderBy('room.updated_at', 'DESC')
      .getMany();
  }

  async addUserToChat(chat: ChatI, creator: UserI): Promise<ChatI> {
    chat.users!.push(creator);
    return this.chatRepository.save(chat);
  }
}
