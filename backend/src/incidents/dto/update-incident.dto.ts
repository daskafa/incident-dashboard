import { IsString, IsEnum, IsOptional } from 'class-validator';
import { IncidentSeverity, IncidentStatus } from '../entities/incident.entity';

export class UpdateIncidentDto {
  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(IncidentSeverity)
  @IsOptional()
  severity?: IncidentSeverity;

  @IsEnum(IncidentStatus)
  @IsOptional()
  status?: IncidentStatus;
}
