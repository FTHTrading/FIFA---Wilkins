import { Controller, Get, Query, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MapsService } from './maps.service';
import { SearchPoisDto, OnlineSearchDto } from './dto/maps-search.dto';

@ApiTags('maps')
@Controller('maps')
export class MapsController {
  constructor(private mapsService: MapsService) {}

  @Get('health')
  health() {
    return this.mapsService.getSourceHealth();
  }

  @Get('venues/:venueId/pois')
  getVenuePois(
    @Param('venueId') venueId: string,
    @Query() dto: SearchPoisDto,
  ) {
    return this.mapsService.searchVenuePOIs({
      venueId,
      language: dto.lang,
      category: dto.category,
      query: dto.q,
    });
  }

  @Get('online/search')
  onlineSearch(@Query() dto: OnlineSearchDto) {
    return this.mapsService.searchOnlineContext({
      query: dto.q,
      language: dto.lang,
      worldview: dto.worldview,
      latitude: dto.lat,
      longitude: dto.lng,
    });
  }
}
