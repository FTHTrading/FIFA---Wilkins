import { Controller, Post, Get, Body, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TranslationService } from './translation.service';
import { IsString, IsOptional, Length } from 'class-validator';

class TranslateDto {
  @IsString()
  @Length(1, 2000)
  text!: string;

  @IsString()
  from!: string;

  @IsString()
  to!: string;

  @IsOptional()
  @IsString()
  eventId?: string;
}

@ApiTags('translation')
@Controller('translation')
export class TranslationController {
  constructor(private translationService: TranslationService) {}

  @Post('translate')
  translate(@Body() dto: TranslateDto) {
    return this.translationService.translate(dto.text, dto.from, dto.to, undefined, dto.eventId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('approved')
  getApproved(@Query('key') key: string, @Query('eventId') eventId?: string) {
    return this.translationService.getApprovedTranslations(key, eventId);
  }
}
