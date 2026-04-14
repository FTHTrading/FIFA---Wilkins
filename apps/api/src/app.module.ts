import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bull';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './common/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { EventsModule } from './modules/events/events.module';
import { TranslationModule } from './modules/translation/translation.module';
import { EmergencyModule } from './modules/emergency/emergency.module';
import { ConciergeModule } from './modules/concierge/concierge.module';
import { ChatModule } from './modules/chat/chat.module';
import { CampaignsModule } from './modules/campaigns/campaigns.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { HealthModule } from './modules/health/health.module';
import { MapsModule } from './modules/maps/maps.module';
import { AgenticModule } from './modules/agentic/agentic.module';
import { TelecomModule } from './modules/telecom/telecom.module';
import { appConfig } from './common/config/app.config';
import { RequestIdMiddleware } from './common/middleware/request-id.middleware';
import { AuditService } from './common/services/audit.service';

@Module({
  imports: [
    // Config
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      envFilePath: ['.env.local', '.env'],
    }),

    // Rate limiting
    ThrottlerModule.forRoot([
      { name: 'short', ttl: 1000, limit: 20 },
      { name: 'medium', ttl: 60_000, limit: 200 },
    ]),

    // Cron jobs
    ScheduleModule.forRoot(),

    // BullMQ queues
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST ?? 'localhost',
        port: parseInt(process.env.REDIS_PORT ?? '6379'),
        password: process.env.REDIS_PASSWORD,
      },
    }),

    // Core
    PrismaModule,
    HealthModule,

    // Domain modules
    AuthModule,
    EventsModule,
    TranslationModule,
    EmergencyModule,
    ConciergeModule,
    ChatModule,
    CampaignsModule,
    AnalyticsModule,
    MapsModule,
    AgenticModule,
    TelecomModule,
  ],
  providers: [
    // Global throttle guard — applies to all routes
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    // Audit logging — inject anywhere via constructor
    AuditService,
  ],
  exports: [AuditService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}
