// import {
//   SubscribeMessage,
//   WebSocketGateway,
//   WebSocketServer,
//   MessageBody,
// } from '@nestjs/websockets';
// import { Logger } from '@nestjs/common';
// import { Server, Socket } from 'socket.io';
// import { AddMessageDto } from './models/add-message.dto';
// @WebSocketGateway({ cors: { origin: '*' } })
// export class ChatGateway {
//   @WebSocketServer()
//   server: Server;
//   private logger = new Logger('ChatGateway');
//   @SubscribeMessage('chat') // subscribe to chat event messages
//   handleMessage(@MessageBody() payload: AddMessageDto): AddMessageDto {
//     this.logger.log(`Message received: ${payload.author} - ${payload.body}`);
//     this.server.emit('chat', payload); // broadbast a message to all clients
//     return payload; // return the same payload data
//   }
//   // it will be handled when a client connects to the server
//   handleConnection(socket: Socket) {
//     this.logger.log(`Socket connected: ${socket.id}`);
//   }

//   // it will be handled when a client disconnects from the server
//   handleDisconnect(socket: Socket) {
//     this.logger.log(`Socket disconnected: ${socket.id}`);
//   }
// }

import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from '../chat/chat.service';
import { MessageService } from '../message/message.service';
import { Logger, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { UserI } from 'src/users/models/user.interface';
import { ChatI } from './models/chat.interface';
import { MessageI } from 'src/message/models/message.interface';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger = new Logger('ChatGateway');

  constructor(
    private userService: UsersService,
    private chatService: ChatService,
    private messageService: MessageService,
  ) {}

  // async handleConnection(socket: Socket) {
  //   try {
  //     const user: UserI = await this.userService.findOne(socket.data.user.id);
  //     if (!user) {
  //       return this.disconnect(socket);
  //     } else {
  //       socket.data.user = user;
  //       const chats = await this.chatService.getChatsForUser(user.id!);
  //       return this.server.to(socket.id).emit('chats', chats);
  //     }
  //   } catch {
  //     return this.disconnect(socket);
  //   }
  // }
  handleConnection(socket: Socket) {
    this.logger.log(`Socket connected: ${socket.id}`);
  }

  async handleDisconnect(socket: Socket) {
    socket.disconnect();
  }

  private disconnect(socket: Socket) {
    socket.emit('Error', new UnauthorizedException());
    socket.disconnect();
  }

  @SubscribeMessage('createChat')
  async onCreateChat(socket: Socket, chat: ChatI) {
    const createdChat: ChatI = await this.chatService.createChat(
      chat,
      socket.data.user,
    );
    return this.server.to(socket.id).emit('chatCreated', createdChat);
  }

  @SubscribeMessage('joinChat')
  async onJoinChat(socket: Socket, chat: ChatI) {
    const messages = await this.messageService.findMessagesForChat(chat.id!);
    return this.server.to(socket.id).emit('messages', messages);
  }

  @SubscribeMessage('load_chat')
  async onLoadChat(socket: Socket, chat: ChatI) {
    const messages = await this.messageService.findMessagesForChat(chat.id!);
    console.log('Chat messages loaded', messages);
    console.log(socket.id);
    return this.server.to(socket.id).emit('loaded_messages', messages);
  }

  @SubscribeMessage('new_msg')
  async onAddMessage(socket: Socket, message: MessageI) {
    const createdMessage: MessageI = await this.messageService.create({
      ...message,
      user: message.user,
    });
    console.log(socket.id, 'new msg');
    return this.server.to(socket.id).emit('add_msg', createdMessage);
  }
}
