import { Processor, Process } from '@nestjs/bull';
import type { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { TranslationService } from './translation.service';

interface TranslationJob {
  text: string;
  from: string;
  to: string;
  key?: string;
  eventId?: string;
}

@Processor('translation')
export class TranslationProcessor {
  private readonly logger = new Logger(TranslationProcessor.name);

  constructor(private translationService: TranslationService) {}

  @Process('translate')
  async handleTranslate(job: Job<TranslationJob>) {
    const { text, from, to, key, eventId } = job.data;
    this.logger.debug(`Processing translation job: ${from} → ${to}`);
    return this.translationService.translate(text, from, to, key, eventId);
  }
}
