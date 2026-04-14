import { Controller, Get, Post, Param, Body, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EmergencyService } from './emergency.service';
import { IsString, IsOptional } from 'class-validator';

class CreateIncidentDto {
  @IsString() sessionId!: string;
  @IsString() phraseKey!: string;
  @IsString() language!: string;
  @IsOptional() @IsString() eventId?: string;
  @IsOptional() @IsString() venueId?: string;
  @IsOptional() @IsString() location?: string;
}

@ApiTags('emergency')
@Controller('emergency')
export class EmergencyController {
  constructor(private emergencyService: EmergencyService) {}

  @Get('phrases')
  getAllPhrases() {
    return this.emergencyService.getAllPhrases();
  }

  @Get('phrases/:key')
  getPhrase(@Param('key') key: string) {
    return this.emergencyService.getPhraseByKey(key);
  }

  @Get('options')
  getOptions(@Query('lang') language = 'en') {
    return this.emergencyService.getEmergencyOptions(language);
  }

  @Post('incidents')
  createIncident(@Body() dto: CreateIncidentDto) {
    return this.emergencyService.createIncident(dto);
  }
}
