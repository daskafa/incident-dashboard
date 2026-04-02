import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { IncidentsService } from './incidents.service';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { UpdateIncidentDto } from './dto/update-incident.dto';
import { QueryIncidentDto } from './dto/query-incident.dto';
import { IncidentsGateway } from './incidents.gateway';

@Controller('incidents')
export class IncidentsController {
  constructor(
    private readonly incidentsService: IncidentsService,
    private readonly incidentsGateway: IncidentsGateway,
  ) {}

  @Post()
  async create(@Body() createIncidentDto: CreateIncidentDto) {
    const incident = await this.incidentsService.create(createIncidentDto);
    this.incidentsGateway.notifyIncidentCreated(incident);
    return incident;
  }

  @Get()
  findAll(@Query() query: QueryIncidentDto) {
    return this.incidentsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.incidentsService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateIncidentDto: UpdateIncidentDto) {
    const incident = await this.incidentsService.update(id, updateIncidentDto);
    this.incidentsGateway.notifyIncidentUpdated(incident);
    return incident;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.incidentsService.remove(id);
    this.incidentsGateway.notifyIncidentDeleted(id);
  }
}
