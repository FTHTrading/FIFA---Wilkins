import { IsString, IsOptional, IsNumberString, MaxLength, MinLength, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Validated query parameters for the concierge-assist endpoint.
 * Prevents excessively long queries, script injection, and invalid coordinates.
 */
export class ConciergeAssistQueryDto {
  @ApiProperty({ description: 'User natural-language query (max 500 chars)' })
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  q!: string;

  @ApiProperty({ description: 'BCP-47 language code, e.g. ar / es / en' })
  @IsString()
  @MinLength(2)
  @MaxLength(10)
  /** Allow only safe BCP-47 language codes: letters, hyphens, numbers (e.g. zh-CN) */
  @Matches(/^[a-zA-Z]{2,3}(-[a-zA-Z0-9]{2,4})*$/, {
    message: 'lang must be a valid BCP-47 language code (e.g. en, ar, zh-CN)',
  })
  lang!: string;

  @ApiProperty({ description: 'Venue slug identifier' })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  venueId!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  eventId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  region?: string;

  @ApiPropertyOptional({ description: 'Latitude -90 to 90' })
  @IsOptional()
  @IsNumberString()
  lat?: string;

  @ApiPropertyOptional({ description: 'Longitude -180 to 180' })
  @IsOptional()
  @IsNumberString()
  lng?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(20)
  worldview?: string;
}
