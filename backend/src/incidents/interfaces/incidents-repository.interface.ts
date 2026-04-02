import { Incident } from '../entities/incident.entity';
import { CreateIncidentDto } from '../dto/create-incident.dto';
import { UpdateIncidentDto } from '../dto/update-incident.dto';
import { QueryIncidentDto } from '../dto/query-incident.dto';

export interface IIncidentsRepository {
  create(createIncidentDto: CreateIncidentDto): Incident;
  save(incident: Incident): Promise<Incident>;
  findAllWithFilters(query: QueryIncidentDto): Promise<[Incident[], number]>;
  findById(id: string): Promise<Incident | null>;
  remove(incident: Incident): Promise<Incident>;
}
