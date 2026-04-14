import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AgenticService } from './agentic.service';

@ApiTags('agentic')
@Controller('agentic')
export class AgenticController {
  constructor(private agenticService: AgenticService) {}

  @Get('concierge-assist')
  conciergeAssist(
    @Query('q') query: string,
    @Query('lang') language: string,
    @Query('venueId') venueId: string,
    @Query('eventId') eventId?: string,
    @Query('region') region?: string,
    @Query('lat') latitude?: string,
    @Query('lng') longitude?: string,
    @Query('worldview') worldview?: string,
  ) {
    return this.agenticService.conciergeAssist({
      query,
      language,
      venueId,
      eventId,
      region,
      worldview,
      latitude: latitude ? Number(latitude) : undefined,
      longitude: longitude ? Number(longitude) : undefined,
    });
  }
}
