-- Telecom channel support for Wilkins Media FIFA AI Connection System

CREATE TYPE "TelecomChannel" AS ENUM ('SMS', 'VOICE', 'WHATSAPP');
CREATE TYPE "TelecomDirection" AS ENUM ('INBOUND', 'OUTBOUND');
CREATE TYPE "TelecomMessageStatus" AS ENUM ('RECEIVED', 'PROCESSED', 'SENT', 'DELIVERED', 'FAILED');
CREATE TYPE "TelecomProvider" AS ENUM ('TELNYX', 'MOCK', 'OTHER');

CREATE TABLE "TelecomSession" (
  "id" TEXT NOT NULL,
  "phoneNumber" TEXT NOT NULL,
  "normalizedPhone" TEXT NOT NULL,
  "channel" "TelecomChannel" NOT NULL DEFAULT 'SMS',
  "provider" "TelecomProvider" NOT NULL DEFAULT 'TELNYX',
  "guestSessionId" TEXT,
  "eventId" TEXT,
  "preferredLanguage" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT TRUE,
  "lastInboundAt" TIMESTAMP(3),
  "lastOutboundAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "TelecomSession_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "InboundMessage" (
  "id" TEXT NOT NULL,
  "telecomSessionId" TEXT,
  "sessionId" TEXT,
  "phoneNumber" TEXT NOT NULL,
  "body" TEXT NOT NULL,
  "normalizedBody" TEXT NOT NULL,
  "detectedLanguage" TEXT,
  "intent" TEXT,
  "campaignId" TEXT,
  "rewardId" TEXT,
  "emergencyFlag" BOOLEAN NOT NULL DEFAULT FALSE,
  "externalMessageId" TEXT,
  "externalProvider" TEXT,
  "direction" "TelecomDirection" NOT NULL DEFAULT 'INBOUND',
  "status" "TelecomMessageStatus" NOT NULL DEFAULT 'RECEIVED',
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "InboundMessage_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "OutboundMessage" (
  "id" TEXT NOT NULL,
  "telecomSessionId" TEXT,
  "sessionId" TEXT,
  "phoneNumber" TEXT NOT NULL,
  "body" TEXT NOT NULL,
  "detectedLanguage" TEXT,
  "intent" TEXT,
  "campaignId" TEXT,
  "rewardId" TEXT,
  "emergencyFlag" BOOLEAN NOT NULL DEFAULT FALSE,
  "externalMessageId" TEXT,
  "externalProvider" TEXT,
  "direction" "TelecomDirection" NOT NULL DEFAULT 'OUTBOUND',
  "status" "TelecomMessageStatus" NOT NULL DEFAULT 'SENT',
  "deliveredAt" TIMESTAMP(3),
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "OutboundMessage_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "DeliveryStatus" (
  "id" TEXT NOT NULL,
  "outboundMessageId" TEXT NOT NULL,
  "externalMessageId" TEXT NOT NULL,
  "providerStatus" TEXT NOT NULL,
  "status" "TelecomMessageStatus" NOT NULL,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "DeliveryStatus_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TelecomEvent" (
  "id" TEXT NOT NULL,
  "telecomSessionId" TEXT,
  "sessionId" TEXT,
  "eventId" TEXT,
  "type" TEXT NOT NULL,
  "channel" "TelecomChannel" NOT NULL DEFAULT 'SMS',
  "phoneNumber" TEXT,
  "language" TEXT,
  "intent" TEXT,
  "campaignId" TEXT,
  "rewardId" TEXT,
  "emergencyFlag" BOOLEAN NOT NULL DEFAULT FALSE,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "TelecomEvent_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "EscalationEvent" (
  "id" TEXT NOT NULL,
  "inboundMessageId" TEXT NOT NULL,
  "emergencyIncidentId" TEXT,
  "assistanceRequestId" TEXT,
  "severity" TEXT NOT NULL DEFAULT 'high',
  "status" TEXT NOT NULL DEFAULT 'open',
  "notes" TEXT,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "EscalationEvent_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PhoneNumberBinding" (
  "id" TEXT NOT NULL,
  "phoneNumber" TEXT NOT NULL,
  "normalizedPhone" TEXT NOT NULL,
  "provider" "TelecomProvider" NOT NULL DEFAULT 'TELNYX',
  "channel" "TelecomChannel" NOT NULL DEFAULT 'SMS',
  "label" TEXT,
  "isPrimary" BOOLEAN NOT NULL DEFAULT FALSE,
  "isActive" BOOLEAN NOT NULL DEFAULT TRUE,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PhoneNumberBinding_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ChannelPreference" (
  "id" TEXT NOT NULL,
  "telecomSessionId" TEXT NOT NULL,
  "preferredLanguage" TEXT,
  "smsOptIn" BOOLEAN NOT NULL DEFAULT TRUE,
  "voiceOptIn" BOOLEAN NOT NULL DEFAULT TRUE,
  "whatsappOptIn" BOOLEAN NOT NULL DEFAULT FALSE,
  "lastUpdatedBy" TEXT,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ChannelPreference_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "TelecomSession_guestSessionId_key" ON "TelecomSession"("guestSessionId");
CREATE UNIQUE INDEX "TelecomSession_normalizedPhone_channel_key" ON "TelecomSession"("normalizedPhone", "channel");
CREATE UNIQUE INDEX "PhoneNumberBinding_phoneNumber_key" ON "PhoneNumberBinding"("phoneNumber");
CREATE UNIQUE INDEX "PhoneNumberBinding_normalizedPhone_key" ON "PhoneNumberBinding"("normalizedPhone");

CREATE INDEX "TelecomSession_eventId_channel_idx" ON "TelecomSession"("eventId", "channel");
CREATE INDEX "InboundMessage_sessionId_createdAt_idx" ON "InboundMessage"("sessionId", "createdAt");
CREATE INDEX "InboundMessage_detectedLanguage_intent_idx" ON "InboundMessage"("detectedLanguage", "intent");
CREATE INDEX "InboundMessage_emergencyFlag_createdAt_idx" ON "InboundMessage"("emergencyFlag", "createdAt");
CREATE INDEX "InboundMessage_telecomSessionId_createdAt_idx" ON "InboundMessage"("telecomSessionId", "createdAt");
CREATE INDEX "OutboundMessage_sessionId_createdAt_idx" ON "OutboundMessage"("sessionId", "createdAt");
CREATE INDEX "OutboundMessage_detectedLanguage_intent_idx" ON "OutboundMessage"("detectedLanguage", "intent");
CREATE INDEX "OutboundMessage_campaignId_idx" ON "OutboundMessage"("campaignId");
CREATE INDEX "OutboundMessage_telecomSessionId_createdAt_idx" ON "OutboundMessage"("telecomSessionId", "createdAt");
CREATE INDEX "DeliveryStatus_externalMessageId_createdAt_idx" ON "DeliveryStatus"("externalMessageId", "createdAt");
CREATE INDEX "DeliveryStatus_providerStatus_idx" ON "DeliveryStatus"("providerStatus");
CREATE INDEX "TelecomEvent_type_createdAt_idx" ON "TelecomEvent"("type", "createdAt");
CREATE INDEX "TelecomEvent_eventId_type_idx" ON "TelecomEvent"("eventId", "type");
CREATE INDEX "TelecomEvent_sessionId_createdAt_idx" ON "TelecomEvent"("sessionId", "createdAt");
CREATE INDEX "TelecomEvent_campaignId_idx" ON "TelecomEvent"("campaignId");
CREATE INDEX "EscalationEvent_severity_createdAt_idx" ON "EscalationEvent"("severity", "createdAt");
CREATE INDEX "EscalationEvent_status_createdAt_idx" ON "EscalationEvent"("status", "createdAt");
CREATE INDEX "PhoneNumberBinding_isPrimary_isActive_idx" ON "PhoneNumberBinding"("isPrimary", "isActive");
CREATE INDEX "ChannelPreference_telecomSessionId_idx" ON "ChannelPreference"("telecomSessionId");

ALTER TABLE "TelecomSession"
  ADD CONSTRAINT "TelecomSession_guestSessionId_fkey"
  FOREIGN KEY ("guestSessionId") REFERENCES "GuestSession"("sessionId") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "InboundMessage"
  ADD CONSTRAINT "InboundMessage_telecomSessionId_fkey"
  FOREIGN KEY ("telecomSessionId") REFERENCES "TelecomSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "InboundMessage"
  ADD CONSTRAINT "InboundMessage_sessionId_fkey"
  FOREIGN KEY ("sessionId") REFERENCES "GuestSession"("sessionId") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "OutboundMessage"
  ADD CONSTRAINT "OutboundMessage_telecomSessionId_fkey"
  FOREIGN KEY ("telecomSessionId") REFERENCES "TelecomSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "OutboundMessage"
  ADD CONSTRAINT "OutboundMessage_sessionId_fkey"
  FOREIGN KEY ("sessionId") REFERENCES "GuestSession"("sessionId") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "DeliveryStatus"
  ADD CONSTRAINT "DeliveryStatus_outboundMessageId_fkey"
  FOREIGN KEY ("outboundMessageId") REFERENCES "OutboundMessage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "TelecomEvent"
  ADD CONSTRAINT "TelecomEvent_telecomSessionId_fkey"
  FOREIGN KEY ("telecomSessionId") REFERENCES "TelecomSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "TelecomEvent"
  ADD CONSTRAINT "TelecomEvent_sessionId_fkey"
  FOREIGN KEY ("sessionId") REFERENCES "GuestSession"("sessionId") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "EscalationEvent"
  ADD CONSTRAINT "EscalationEvent_inboundMessageId_fkey"
  FOREIGN KEY ("inboundMessageId") REFERENCES "InboundMessage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ChannelPreference"
  ADD CONSTRAINT "ChannelPreference_telecomSessionId_fkey"
  FOREIGN KEY ("telecomSessionId") REFERENCES "TelecomSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
