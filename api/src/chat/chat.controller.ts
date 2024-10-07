import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { ChatService } from './chat.service';
import { UsersService } from 'src/users/users.service';
import { ChatI } from './models/chat.interface';
import { UserI } from 'src/users/models/user.interface';

@Controller('chat')
export class ChatController {
  constructor(
    private chatService: ChatService,
    private userService: UsersService,
  ) {}

  @Get('/:id')
  async getChat(@Param('id') id: number): Promise<ChatI> {
    console.log('getChat', id);
    return this.chatService.getChat(id);
  }

  @Post()
  async createChat(
    @Body() payload: { chat: ChatI; user: UserI },
  ): Promise<ChatI> {
    return this.chatService.createChat(payload.chat, payload.user);
  }

  @Get('user/:id')
  async getChatsForUser(@Param('id') id: number): Promise<ChatI[]> {
    return this.chatService.getChatsForUser(id);
  }

  @Put()
  async addUserToChat(
    @Body() payload: { chatId: number; userId: number },
  ): Promise<ChatI> {
    const chat = await this.chatService.getChat(payload.chatId);
    const user = await this.userService.findOne(payload.userId);
    return this.chatService.addUserToChat(chat, user);
  }
}
