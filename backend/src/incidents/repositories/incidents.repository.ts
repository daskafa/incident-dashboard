import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Incident } from '../entities/incident.entity';
import { CreateIncidentDto } from '../dto/create-incident.dto';
import { QueryIncidentDto } from '../dto/query-incident.dto';
import { IIncidentsRepository } from '../interfaces/incidents-repository.interface';

@Injectable()
export class IncidentsRepository implements IIncidentsRepository {
  constructor(
    @InjectRepository(Incident)
    private readonly repository: Repository<Incident>,
  ) {}

  create(createIncidentDto: CreateIncidentDto): Incident {
    return this.repository.create(createIncidentDto);
  }

  async save(incident: Incident): Promise<Incident> {
    return await this.repository.save(incident);
  }

  async findAllWithFilters(query: QueryIncidentDto): Promise<[Incident[], number]> {
    const { page = 1, limit = 10, status, severity, service } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.repository
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

    return await queryBuilder.getManyAndCount();
  }

  async findById(id: string): Promise<Incident | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async remove(incident: Incident): Promise<Incident> {
    return await this.repository.remove(incident);
  }
}
