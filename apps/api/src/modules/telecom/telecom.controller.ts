import { Body, Controller, Get, Headers, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { TelecomService } from './telecom.service';
import type { TelnyxWebhookHeaders } from './telecom.types';

class SendSmsDto {
  @IsString() to!: string;
  @IsString() text!: string;
}

@ApiTags('telecom')
@Controller('telecom')
export class TelecomController {
  constructor(private readonly telecomService: TelecomService) {}

  @Post('webhooks/telnyx/sms')
  inboundSms(
    @Body() payload: Record<string, unknown>,
    @Headers('x-telnyx-signature-ed25519') signature?: string,
    @Headers('x-telnyx-timestamp') timestamp?: string,
  ) {
    const headers: TelnyxWebhookHeaders = { signature, timestamp };
    return this.telecomService.handleInboundSmsWebhook(payload, headers);
  }

  @Post('webhooks/telnyx/status')
  deliveryStatus(@Body() payload: Record<string, unknown>) {
    return this.telecomService.handleDeliveryStatusWebhook(payload);
  }

  @Post('webhooks/telnyx/voice')
  inboundVoice(@Body() payload: Record<string, unknown>) {
    return this.telecomService.handleInboundVoiceWebhook(payload);
  }

  @Post('send')
  sendSms(@Body() dto: SendSmsDto) {
    return this.telecomService.sendManualSms(dto.to, dto.text);
  }

  @Get('summary')
  summary(
    @Query('eventId') eventId?: string,
    @Query('days') days?: string,
  ) {
    const windowDays = Number(days ?? 7);
    return this.telecomService.getSummary(eventId, Number.isFinite(windowDays) ? windowDays : 7);
  }

  @Get('health')
  health() {
    return this.telecomService.getHealth();
  }

  @Get('cta')
  cta(@Query('lang') lang = 'en') {
    return this.telecomService.getPublicCta(lang);
  }
}
