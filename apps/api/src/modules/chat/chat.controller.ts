import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { IsString, IsOptional } from 'class-validator';

class CreateConversationDto {
  @IsString() guestSessionId!: string;
  @IsString() eventId!: string;
  @IsString() guestLanguage!: string;
}

@ApiTags('chat')
@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Post('conversations')
  create(@Body() dto: CreateConversationDto) {
    return this.chatService.createConversation(dto.guestSessionId, dto.eventId, dto.guestLanguage);
  }

  @Get('conversations/:id/messages')
  getMessages(@Param('id') id: string) {
    return this.chatService.getMessages(id);
  }
}
