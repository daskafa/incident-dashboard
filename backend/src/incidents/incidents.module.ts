import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IncidentsController } from './incidents.controller';
import { IncidentsService } from './incidents.service';
import { IncidentsGateway } from './incidents.gateway';
import { Incident } from './entities/incident.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Incident])],
  controllers: [IncidentsController],
  providers: [IncidentsService, IncidentsGateway],
})
export class IncidentsModule {}
