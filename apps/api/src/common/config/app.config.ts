import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
  env: process.env.NODE_ENV ?? 'development',
  port: parseInt(process.env.PORT ?? '4000'),
  jwtSecret: (() => {
    const secret = process.env.JWT_SECRET;
    if (!secret && process.env.NODE_ENV === 'production') {
      throw new Error('JWT_SECRET environment variable must be set in production');
    }
    return secret ?? 'dev-jwt-secret-change-me-never-use-in-production';
  })(),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  corsOrigins: process.env.CORS_ORIGINS?.split(',') ?? ['http://localhost:3000'],

  db: {
    url: process.env.DATABASE_URL,
  },

  redis: {
    host: process.env.REDIS_HOST ?? 'localhost',
    port: parseInt(process.env.REDIS_PORT ?? '6379'),
    password: process.env.REDIS_PASSWORD,
  },

  translation: {
    provider: process.env.TRANSLATION_PROVIDER ?? 'azure', // 'azure' | 'google' | 'deepl'
    azureKey: process.env.AZURE_TRANSLATOR_KEY,
    azureRegion: process.env.AZURE_TRANSLATOR_REGION,
    googleKey: process.env.GOOGLE_TRANSLATE_KEY,
    deeplKey: process.env.DEEPL_API_KEY,
  },

  ocr: {
    provider: process.env.OCR_PROVIDER ?? 'azure',
    azureKey: process.env.AZURE_VISION_KEY,
    azureEndpoint: process.env.AZURE_VISION_ENDPOINT,
  },

  tts: {
    provider: process.env.TTS_PROVIDER ?? 'azure',
    azureKey: process.env.AZURE_SPEECH_KEY,
    azureRegion: process.env.AZURE_SPEECH_REGION,
  },

  maps: {
    mapboxToken: process.env.MAPBOX_ACCESS_TOKEN ?? process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
    overpassEndpoint: process.env.OVERPASS_ENDPOINT ?? 'https://overpass-api.de/api/interpreter',
  },

  agentic: {
    ragProvider: process.env.RAG_PROVIDER ?? 'local',
    vectorIndex: process.env.RAG_VECTOR_INDEX ?? 'wilkins-cultural-index',
    mcpEnabled: process.env.MCP_AGENTIC_ENABLED === 'true',
  },

  telecom: {
    provider: process.env.TELECOM_PROVIDER ?? 'telnyx',
    telnyxApiKey: process.env.TELNYX_API_KEY,
    telnyxPublicKey: process.env.TELNYX_PUBLIC_KEY,
    telnyxMessagingProfileId: process.env.TELNYX_MESSAGING_PROFILE_ID,
    telnyxConnectionId: process.env.TELNYX_CONNECTION_ID,
    telnyxPhoneNumber: process.env.TELNYX_PHONE_NUMBER ?? '+18888273432',
    defaultEventId: process.env.TELECOM_DEFAULT_EVENT_ID,
    defaultVenueId: process.env.TELECOM_DEFAULT_VENUE_ID,
    publicBaseUrl: process.env.TELECOM_PUBLIC_BASE_URL,
    shortLinkBaseUrl: process.env.SHORT_LINK_BASE_URL,
  },
}));
