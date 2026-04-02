import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { Incident } from './entities/incident.entity';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { UpdateIncidentDto } from './dto/update-incident.dto';
import { QueryIncidentDto } from './dto/query-incident.dto';
import type { IIncidentsRepository } from './interfaces/incidents-repository.interface';

@Injectable()
export class IncidentsService {
  constructor(
    @Inject('IIncidentsRepository')
    private readonly incidentsRepository: IIncidentsRepository,
  ) {}

  async create(createIncidentDto: CreateIncidentDto): Promise<Incident> {
    const incident = this.incidentsRepository.create(createIncidentDto);
    return await this.incidentsRepository.save(incident);
  }

  async findAll(query: QueryIncidentDto) {
    const { page = 1, limit = 10 } = query;
    const [data, total] = await this.incidentsRepository.findAllWithFilters(query);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<Incident> {
    const incident = await this.incidentsRepository.findById(id);
    
    if (!incident) {
      throw new NotFoundException(`Incident with ID ${id} not found`);
    }
    
    return incident;
  }

  async update(id: string, updateIncidentDto: UpdateIncidentDto): Promise<Incident> {
    const incident = await this.findOne(id);
    Object.assign(incident, updateIncidentDto);
    await this.incidentsRepository.save(incident);
    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const incident = await this.findOne(id);
    await this.incidentsRepository.remove(incident);
  }
}
