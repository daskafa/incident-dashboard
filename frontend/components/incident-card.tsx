'use client';

import { Incident, IncidentSeverity, IncidentStatus } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface IncidentCardProps {
  incident: Incident;
  onStatusChange: (id: string, status: IncidentStatus) => void;
  onDelete: (id: string) => void;
}

const severityColors = {
  [IncidentSeverity.LOW]: 'bg-blue-500/10 text-blue-700 border-blue-500/20 hover:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500/30',
  [IncidentSeverity.MEDIUM]: 'bg-amber-500/10 text-amber-700 border-amber-500/20 hover:bg-amber-500/20 dark:text-amber-400 dark:border-amber-500/30',
  [IncidentSeverity.HIGH]: 'bg-orange-500/10 text-orange-700 border-orange-500/20 hover:bg-orange-500/20 dark:text-orange-400 dark:border-orange-500/30',
  [IncidentSeverity.CRITICAL]: 'bg-red-500/10 text-red-700 border-red-500/20 hover:bg-red-500/20 dark:text-red-400 dark:border-red-500/30',
};

const statusColors = {
  [IncidentStatus.OPEN]: 'bg-slate-500/10 text-slate-700 border-slate-500/20 hover:bg-slate-500/20 dark:text-slate-400 dark:border-slate-500/30',
  [IncidentStatus.INVESTIGATING]: 'bg-violet-500/10 text-violet-700 border-violet-500/20 hover:bg-violet-500/20 dark:text-violet-400 dark:border-violet-500/30',
  [IncidentStatus.RESOLVED]: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20 hover:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30',
};

export function IncidentCard({ incident, onStatusChange, onDelete }: IncidentCardProps) {
  // Güvenlik kontrolü
  if (!incident || !incident.severity || !incident.status) {
    return null;
  }

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-l-4 hover:scale-[1.02] h-full flex flex-col overflow-hidden"
      style={{
        borderLeftColor: 
          incident.severity === IncidentSeverity.CRITICAL ? '#ef4444' :
          incident.severity === IncidentSeverity.HIGH ? '#f97316' :
          incident.severity === IncidentSeverity.MEDIUM ? '#f59e0b' :
          '#3b82f6'
      }}
    >
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={`${severityColors[incident.severity]} cursor-default border font-semibold`}>
                {incident.severity?.charAt(0).toUpperCase() + incident.severity?.slice(1)}
              </Badge>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">{incident.service}</span>
            </div>
            <CardTitle className="text-xl font-bold leading-tight group-hover:text-primary transition-colors">
              {incident.title}
            </CardTitle>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onDelete(incident.id)}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-4 pt-0">
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {incident.description}
        </p>
        
        <div className="mt-auto pt-4 border-t space-y-3">
          <div className="flex items-center justify-between">
            <Badge className={`${statusColors[incident.status]} cursor-default border-2`}>
              {incident.status?.charAt(0).toUpperCase() + incident.status?.slice(1)}
            </Badge>
            <Select
              value={incident.status}
              onValueChange={(value) => {
                if (value) {
                  onStatusChange(incident.id, value as IncidentStatus);
                }
              }}
            >
              <SelectTrigger className="w-[150px] h-9 cursor-pointer border-dashed">
                <SelectValue>
                  Update Status
                </SelectValue>
              </SelectTrigger>
              <SelectContent side="bottom" align="end">
                <SelectItem value={IncidentStatus.OPEN}>Open</SelectItem>
                <SelectItem value={IncidentStatus.INVESTIGATING}>Investigating</SelectItem>
                <SelectItem value={IncidentStatus.RESOLVED}>Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {new Date(incident.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
            <span className="font-mono">#{incident.id.slice(0, 8)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
