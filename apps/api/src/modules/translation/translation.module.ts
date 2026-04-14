import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { TranslationController } from './translation.controller';
import { TranslationService } from './translation.service';
import { TranslationProcessor } from './translation.processor';
import { AzureTranslationProvider } from './providers/azure.provider';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'translation' }),
  ],
  controllers: [TranslationController],
  providers: [TranslationService, TranslationProcessor, AzureTranslationProvider],
  exports: [TranslationService],
})
export class TranslationModule {}
