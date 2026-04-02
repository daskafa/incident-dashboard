import { IsOptional, IsEnum, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { IncidentSeverity, IncidentStatus } from '../entities/incident.entity';

export class QueryIncidentDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @IsOptional()
  @IsEnum(IncidentStatus)
  status?: IncidentStatus;

  @IsOptional()
  @IsEnum(IncidentSeverity)
  severity?: IncidentSeverity;

  @IsOptional()
  @IsString()
  service?: string;
}
