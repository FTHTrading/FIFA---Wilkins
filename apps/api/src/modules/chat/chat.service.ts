import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { TranslationService } from '../translation/translation.service';

@Injectable()
export class ChatService {
  constructor(
    private prisma: PrismaService,
    private translationService: TranslationService,
  ) {}

  async createConversation(guestSessionId: string, eventId: string, guestLanguage: string) {
    return this.prisma.conversation.create({
      data: { guestSessionId, eventId, guestLanguage, status: 'OPEN' },
    });
  }

  async sendMessage(data: {
    conversationId: string;
    senderType: 'guest' | 'staff' | 'system';
    senderId?: string;
    text: string;
    lang: string;
    translateTo?: string;
  }) {
    let translatedText: string | undefined;
    let translatedLang: string | undefined;
    let confidence: number | undefined;

    if (data.translateTo && data.translateTo !== data.lang) {
      const result = await this.translationService.translate(
        data.text,
        data.lang,
        data.translateTo,
      );
      translatedText = result.text;
      translatedLang = data.translateTo;
      confidence = result.confidence;
    }

    return this.prisma.message.create({
      data: {
        conversationId: data.conversationId,
        senderType: data.senderType,
        senderId: data.senderId,
        originalText: data.text,
        originalLang: data.lang,
        translatedText,
        translatedLang,
        confidence,
      },
    });
  }

  async getMessages(conversationId: string) {
    return this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
    });
  }
}
