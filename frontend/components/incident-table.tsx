'use client';

import { useState } from 'react';
import { Incident, IncidentSeverity, IncidentStatus } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Trash2, Eye } from 'lucide-react';

interface IncidentTableProps {
  incidents: Incident[];
  onStatusChange: (id: string, status: IncidentStatus) => void;
  onDelete: (id: string) => void;
  newIncidentId?: string | null;
}

const severityColors = {
  [IncidentSeverity.LOW]: 'bg-blue-500/10 text-blue-700 border-blue-500/30',
  [IncidentSeverity.MEDIUM]: 'bg-amber-500/10 text-amber-700 border-amber-500/30',
  [IncidentSeverity.HIGH]: 'bg-orange-500/10 text-orange-700 border-orange-500/30',
  [IncidentSeverity.CRITICAL]: 'bg-red-500/10 text-red-700 border-red-500/30',
};

const statusColors = {
  [IncidentStatus.OPEN]: 'bg-slate-500/10 text-slate-700 border-slate-500/30',
  [IncidentStatus.INVESTIGATING]: 'bg-violet-500/10 text-violet-700 border-violet-500/30',
  [IncidentStatus.RESOLVED]: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30',
};

export function IncidentTable({ incidents, onStatusChange, onDelete, newIncidentId }: IncidentTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [detailIncident, setDetailIncident] = useState<Incident | null>(null);

  return (
    <>
      <div className="rounded-lg border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[35%]">Incident</TableHead>
            <TableHead className="w-[15%]">Service</TableHead>
            <TableHead className="w-[12%]">Severity</TableHead>
            <TableHead className="w-[15%]">Status</TableHead>
            <TableHead className="w-[15%]">Created</TableHead>
            <TableHead className="w-[8%] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {incidents.map((incident) => (
            <TableRow 
              key={incident.id} 
              className={`group hover:bg-muted/50 transition-colors ${
                newIncidentId === incident.id 
                  ? 'animate-[flash_3s_ease-in-out] border-l-4 border-l-emerald-500' 
                  : ''
              }`}
            >
              <TableCell>
                <div className="space-y-1">
                  <div className="font-semibold text-base">{incident.title}</div>
                  <Tooltip>
                    <TooltipTrigger className="text-sm text-muted-foreground text-left block w-full overflow-hidden whitespace-nowrap text-ellipsis max-w-[300px]">
                      {incident.description}
                    </TooltipTrigger>
                    <TooltipContent side="bottom" align="start" className="max-w-md">
                      <p className="text-sm">{incident.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="cursor-default">
                  {incident.service}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={`${severityColors[incident.severity]} cursor-default border`}>
                  {incident.severity?.charAt(0).toUpperCase() + incident.severity?.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>
                <Select
                  value={incident.status}
                  onValueChange={(value) => {
                    if (value) {
                      onStatusChange(incident.id, value as IncidentStatus);
                    }
                  }}
                >
                  <SelectTrigger className="w-auto h-8 cursor-pointer">
                    <SelectValue>
                      <Badge className={`${statusColors[incident.status]} cursor-default border text-xs`}>
                        {incident.status?.charAt(0).toUpperCase() + incident.status?.slice(1)}
                      </Badge>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent side="bottom" align="start">
                    <SelectItem value={IncidentStatus.OPEN}>Open</SelectItem>
                    <SelectItem value={IncidentStatus.INVESTIGATING}>Investigating</SelectItem>
                    <SelectItem value={IncidentStatus.RESOLVED}>Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {new Date(incident.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setDetailIncident(incident)}
                    className="text-muted-foreground hover:text-primary hover:bg-primary/10 cursor-pointer"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setDeleteId(incident.id)}
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>

    {/* Delete Confirmation Dialog */}
    <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the incident.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              if (deleteId) {
                onDelete(deleteId);
                setDeleteId(null);
              }
            }}
            className="bg-destructive text-white hover:bg-destructive/90 cursor-pointer"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    {/* Detail Dialog */}
    <Dialog open={!!detailIncident} onOpenChange={(open) => !open && setDetailIncident(null)}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Incident Details</DialogTitle>
        </DialogHeader>
        {detailIncident && (
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Title</label>
              <p className="text-base mt-1">{detailIncident.title}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Description</label>
              <p className="text-base mt-1">{detailIncident.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Service</label>
                <p className="text-base mt-1">{detailIncident.service}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Severity</label>
                <div className="mt-1">
                  <Badge className={`${severityColors[detailIncident.severity]} cursor-default border`}>
                    {detailIncident.severity?.charAt(0).toUpperCase() + detailIncident.severity?.slice(1)}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <div className="mt-1">
                  <Badge className={`${statusColors[detailIncident.status]} cursor-default border`}>
                    {detailIncident.status?.charAt(0).toUpperCase() + detailIncident.status?.slice(1)}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Created</label>
                <p className="text-base mt-1">
                  {new Date(detailIncident.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
              <p className="text-base mt-1">
                {new Date(detailIncident.updatedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  </>
  );
}
