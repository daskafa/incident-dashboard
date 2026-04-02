import { Incident, CreateIncidentDto, UpdateIncidentDto, IncidentListResponse } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const api = {
  async getIncidents(params?: {
    page?: number;
    limit?: number;
    status?: string;
    severity?: string;
    service?: string;
  }): Promise<IncidentListResponse> {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.status) query.append('status', params.status);
    if (params?.severity) query.append('severity', params.severity);
    if (params?.service) query.append('service', params.service);

    const res = await fetch(`${API_URL}/incidents?${query}`);
    if (!res.ok) throw new Error('Failed to fetch incidents');
    return res.json();
  },

  async getIncident(id: string): Promise<Incident> {
    const res = await fetch(`${API_URL}/incidents/${id}`);
    if (!res.ok) throw new Error('Failed to fetch incident');
    return res.json();
  },

  async createIncident(data: CreateIncidentDto): Promise<Incident> {
    const res = await fetch(`${API_URL}/incidents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create incident');
    return res.json();
  },

  async updateIncident(id: string, data: UpdateIncidentDto): Promise<Incident> {
    const res = await fetch(`${API_URL}/incidents/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update incident');
    return res.json();
  },

  async deleteIncident(id: string): Promise<void> {
    const res = await fetch(`${API_URL}/incidents/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete incident');
  },
};
