import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IncidentsController } from './incidents.controller';
import { IncidentsService } from './incidents.service';
import { IncidentsGateway } from './incidents.gateway';
import { Incident } from './entities/incident.entity';
import { IncidentsRepository } from './repositories/incidents.repository';

const INCIDENTS_REPOSITORY = 'IIncidentsRepository';

@Module({
  imports: [TypeOrmModule.forFeature([Incident])],
  controllers: [IncidentsController],
  providers: [
    IncidentsService,
    IncidentsGateway,
    {
      provide: INCIDENTS_REPOSITORY,
      useClass: IncidentsRepository,
    },
  ],
  exports: [INCIDENTS_REPOSITORY],
})
export class IncidentsModule {}
