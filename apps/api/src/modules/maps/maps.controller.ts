import { Controller, Get, Query, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MapsService } from './maps.service';

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
    @Query('lang') language?: string,
    @Query('category') category?: string,
    @Query('q') query?: string,
  ) {
    return this.mapsService.searchVenuePOIs({ venueId, language, category, query });
  }

  @Get('online/search')
  onlineSearch(
    @Query('q') query: string,
    @Query('lang') language?: string,
    @Query('worldview') worldview?: string,
    @Query('lat') latitude?: string,
    @Query('lng') longitude?: string,
  ) {
    return this.mapsService.searchOnlineContext({
      query,
      language,
      worldview,
      latitude: latitude ? Number(latitude) : undefined,
      longitude: longitude ? Number(longitude) : undefined,
    });
  }
}
