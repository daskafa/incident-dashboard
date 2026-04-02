import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Incident } from './entities/incident.entity';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { UpdateIncidentDto } from './dto/update-incident.dto';
import { QueryIncidentDto } from './dto/query-incident.dto';

@Injectable()
export class IncidentsService {
  constructor(
    @InjectRepository(Incident)
    private readonly incidentRepository: Repository<Incident>,
  ) {}

  async create(createIncidentDto: CreateIncidentDto): Promise<Incident> {
    const incident = this.incidentRepository.create(createIncidentDto);
    return await this.incidentRepository.save(incident);
  }

  async findAll(query: QueryIncidentDto) {
    const { page = 1, limit = 10, status, severity, service } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.incidentRepository
      .createQueryBuilder('incident')
      .orderBy('incident.createdAt', 'DESC')
      .skip(skip)
      .take(limit);

    if (status) {
      queryBuilder.andWhere('incident.status = :status', { status });
    }

    if (severity) {
      queryBuilder.andWhere('incident.severity = :severity', { severity });
    }

    if (service) {
      queryBuilder.andWhere('incident.service = :service', { service });
    }

    const [data, total] = await queryBuilder.getManyAndCount();

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
    try {
      const incident = await this.incidentRepository.findOne({ where: { id } });
      if (!incident) {
        throw new NotFoundException(`Incident with ID ${id} not found`);
      }
      return incident;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException(`Incident with ID ${id} not found`);
    }
  }

  async update(id: string, updateIncidentDto: UpdateIncidentDto): Promise<Incident> {
    const incident = await this.findOne(id);
    Object.assign(incident, updateIncidentDto);
    const updated = await this.incidentRepository.save(incident);
    
    return await this.findOne(updated.id);
  }

  async remove(id: string): Promise<void> {
    const incident = await this.findOne(id);
    await this.incidentRepository.remove(incident);
  }
}
