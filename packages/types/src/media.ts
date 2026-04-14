// ─── OCR / Camera Translation ────────────────────────────────────────────────

export interface OCRRequest {
  imageBase64: string;
  targetLanguage: string;
  sessionId: string;
}

export interface OCRResult {
  id: string;
  extractedText: string;
  translatedText: string;
  targetLanguage: string;
  confidence: number;
  provider: string;
  boundingBoxes?: OCRBoundingBox[];
  createdAt: string;
}

export interface OCRBoundingBox {
  text: string;
  translatedText: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

// ─── Speech / Voice ───────────────────────────────────────────────────────────

export interface STTRequest {
  audioBase64: string;
  languageCode: string;
  sessionId: string;
}

export interface STTResult {
  transcript: string;
  confidence: number;
  provider: string;
}

export interface TTSRequest {
  text: string;
  languageCode: string;
  voiceGender?: 'MALE' | 'FEMALE' | 'NEUTRAL';
}

export interface TTSResult {
  audioBase64: string;
  durationMs: number;
  provider: string;
}
