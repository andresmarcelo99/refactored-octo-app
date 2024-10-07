import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageI } from './models/message.interface';

@Controller('message')
export class MessageController {
  constructor(private messageService: MessageService) {}

  @Post()
  async create(@Body() message: MessageI): Promise<MessageI> {
    return this.messageService.create(message);
  }

  @Get('chat/:id')
  async findMessagesForChat(@Param('id') chatId: number): Promise<MessageI[]> {
    return this.messageService.findMessagesForChat(chatId);
  }
}
