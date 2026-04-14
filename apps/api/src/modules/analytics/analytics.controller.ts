import { Controller, Post, Get, Body, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { IsString, IsOptional } from 'class-validator';
import { Roles } from '@/common/decorators/roles.decorator';
import { RolesGuard } from '@/common/guards/roles.guard';

class TrackEventDto {
  @IsString() type!: string;
  @IsOptional() @IsString() sessionId?: string;
  @IsOptional() @IsString() eventId?: string;
  @IsOptional() @IsString() language?: string;
  @IsOptional() payload?: Record<string, unknown>;
}

@ApiTags('analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Post('track')
  track(@Body() dto: TrackEventDto) {
    return this.analyticsService.track(dto.type, dto.sessionId, dto.eventId, dto.language, dto.payload);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'EDITOR', 'SPONSOR_MANAGER')
  @Get('summary')
  getSummary(@Query('eventId') eventId: string) {
    return this.analyticsService.getSummary(eventId);
  }
}
