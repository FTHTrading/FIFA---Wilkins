import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AgenticService } from './agentic.service';
import { ConciergeAssistQueryDto } from './dto/concierge-assist-query.dto';

@ApiTags('agentic')
@Controller('agentic')
export class AgenticController {
  constructor(private agenticService: AgenticService) {}

  @Get('concierge-assist')
  conciergeAssist(@Query() dto: ConciergeAssistQueryDto) {
    const rawLat = dto.lat !== undefined ? Number(dto.lat) : undefined;
    const rawLng = dto.lng !== undefined ? Number(dto.lng) : undefined;
    const latitude  = rawLat !== undefined && rawLat >= -90  && rawLat <= 90  ? rawLat  : undefined;
    const longitude = rawLng !== undefined && rawLng >= -180 && rawLng <= 180 ? rawLng : undefined;

    return this.agenticService.conciergeAssist({
      query: dto.q,
      language: dto.lang,
      venueId: dto.venueId,
      eventId: dto.eventId,
      region: dto.region,
      worldview: dto.worldview,
      latitude,
      longitude,
    });
  }
}
