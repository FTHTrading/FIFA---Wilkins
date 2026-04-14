import { Injectable, Logger, BadGatewayException } from '@nestjs/common';
import type { ITranslationProvider, TranslationOutput } from '../interfaces/translation-provider.interface';

/**
 * Azure Cognitive Services Translator adapter.
 * Uses the v3.0 REST API with a single API key.
 */
@Injectable()
export class AzureTranslationProvider implements ITranslationProvider {
  private readonly logger = new Logger(AzureTranslationProvider.name);
  private readonly baseUrl = 'https://api.cognitive.microsofttranslator.com';

  private get key() {
    const k = process.env.AZURE_TRANSLATOR_KEY;
    if (!k) {
      this.logger.error('AZURE_TRANSLATOR_KEY is not configured');
      throw new BadGatewayException('Translation service not configured');
    }
    return k;
  }

  private get region() {
    return process.env.AZURE_TRANSLATOR_REGION ?? 'eastus';
  }

  async translate(text: string, from: string, to: string): Promise<TranslationOutput> {
    const [result] = await this.translateBatch([text], from, to);
    return result!;
  }

  async translateBatch(texts: string[], from: string, to: string): Promise<TranslationOutput[]> {
    const url = `${this.baseUrl}/translate?api-version=3.0&from=${from}&to=${to}`;
    const body = texts.map((t) => ({ Text: t }));

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': this.key,
        'Ocp-Apim-Subscription-Region': this.region,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const err = await response.text();
      this.logger.error(`Azure Translator API error: ${err}`);
      throw new BadGatewayException('Translation service unavailable');
    }

    const data = (await response.json()) as Array<{
      translations: Array<{ text: string; to: string }>;
      detectedLanguage?: { language: string; score: number };
    }>;

    return data.map((item) => ({
      text: item.translations[0]?.text ?? '',
      confidence: item.detectedLanguage?.score ?? 1.0,
      provider: 'azure',
      detectedLanguage: item.detectedLanguage?.language,
    }));
  }
}
