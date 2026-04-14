import { Module } from '@nestjs/common';
import { MapsController } from './maps.controller';
import { MapsService } from './maps.service';
import { MapboxSearchProvider } from './providers/mapbox-search.provider';
import { OverpassProvider } from './providers/overpass.provider';

@Module({
  controllers: [MapsController],
  providers: [MapsService, MapboxSearchProvider, OverpassProvider],
  exports: [MapsService],
})
export class MapsModule {}
