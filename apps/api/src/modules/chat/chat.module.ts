import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { TranslationModule } from '../translation/translation.module';
import { AuthModule } from '../auth/auth.module';
import { WsAuthGuard } from '@/common/guards/ws-auth.guard';

@Module({
  imports: [TranslationModule, AuthModule],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway, WsAuthGuard],
})
export class ChatModule {}
