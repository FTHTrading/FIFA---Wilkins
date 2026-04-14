import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ConciergeService } from './concierge.service';
import { ConciergeSearchDto } from './dto/concierge-search.dto';

@ApiTags('concierge')
@Controller('concierge')
export class ConciergeController {
  constructor(private conciergeService: ConciergeService) {}

  @Get()
  search(@Query() dto: ConciergeSearchDto) {
    return this.conciergeService.search({
      eventId: dto.eventId,
      category: dto.category,
      query: dto.q,
      latitude: dto.lat,
      longitude: dto.lng,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.conciergeService.findById(id);
  }
}
