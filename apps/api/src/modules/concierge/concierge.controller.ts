import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ConciergeService } from './concierge.service';

@ApiTags('concierge')
@Controller('concierge')
export class ConciergeController {
  constructor(private conciergeService: ConciergeService) {}

  @Get()
  search(
    @Query('eventId') eventId?: string,
    @Query('category') category?: string,
    @Query('q') query?: string,
    @Query('lat') latitude?: string,
    @Query('lng') longitude?: string,
  ) {
    return this.conciergeService.search({
      eventId,
      category,
      query,
      latitude: latitude ? parseFloat(latitude) : undefined,
      longitude: longitude ? parseFloat(longitude) : undefined,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.conciergeService.findById(id);
  }
}
