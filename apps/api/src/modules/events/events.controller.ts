import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EventsService } from './events.service';

@ApiTags('events')
@Controller('events')
export class EventsController {
  constructor(private eventsService: EventsService) {}

  @Get()
  findAll() {
    return this.eventsService.findAll();
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.eventsService.findBySlug(slug);
  }

  @Get(':slug/alerts')
  getAlerts(@Param('slug') slug: string) {
    return this.eventsService.getActiveAlertsBySlug(slug);
  }

  @Get(':eventId/venues/:venueId/pois')
  getPOIs(@Param('venueId') venueId: string, @Query('category') category?: string) {
    return this.eventsService.findVenuePOIs(venueId, category);
  }
}
