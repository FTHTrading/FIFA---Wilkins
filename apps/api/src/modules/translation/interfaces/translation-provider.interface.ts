/**
 * ITranslationProvider — provider abstraction so Azure, Google, or DeepL
 * can be swapped without changing service logic.
 */
export interface ITranslationProvider {
  translate(text: string, from: string, to: string): Promise<TranslationOutput>;
  translateBatch(texts: string[], from: string, to: string): Promise<TranslationOutput[]>;
}

export interface TranslationOutput {
  text: string;
  confidence: number;
  provider: string;
  detectedLanguage?: string;
}
