export enum IncidentSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum IncidentStatus {
  OPEN = 'open',
  INVESTIGATING = 'investigating',
  RESOLVED = 'resolved',
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  service: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateIncidentDto {
  title: string;
  description: string;
  service: string;
  severity?: IncidentSeverity;
  status?: IncidentStatus;
}

export interface UpdateIncidentDto {
  description?: string;
  severity?: IncidentSeverity;
  status?: IncidentStatus;
}

export interface IncidentListResponse {
  data: Incident[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
