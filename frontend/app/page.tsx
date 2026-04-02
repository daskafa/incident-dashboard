'use client';

import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { Incident, IncidentStatus, CreateIncidentDto } from '@/lib/types';
import { api } from '@/lib/api';
import { IncidentTable } from '@/components/incident-table';
import { CreateIncidentForm } from '@/components/create-incident-form';
import { AlertCircle, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function Home() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newIncidentId, setNewIncidentId] = useState<string | null>(null);
  const isCreatingRef = useRef(false);
  const limit = 15;

  useEffect(() => {
    loadIncidents();

    const newSocket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001');
    setSocket(newSocket);

    newSocket.on('incident:created', (incident: Incident) => {
      setIncidents((prev) => [incident, ...prev]);
      setTotal((prev) => prev + 1);
      
      if (!isCreatingRef.current) {
        setNewIncidentId(incident.id);
        setTimeout(() => setNewIncidentId(null), 3000);
      }
    });

    newSocket.on('incident:updated', (updatedIncident: Incident) => {
      setIncidents((prev) =>
        prev.map((inc) => (inc.id === updatedIncident.id ? updatedIncident : inc))
      );
    });

    newSocket.on('incident:deleted', ({ id }: { id: string }) => {
      setIncidents((prev) => prev.filter((inc) => inc.id !== id));
      setTotal((prev) => prev - 1);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    loadIncidents();
  }, [page]);

  const loadIncidents = async () => {
    try {
      setLoading(true);
      const response = await api.getIncidents({ page, limit });
      setIncidents(response.data);
      setTotalPages(response.meta.totalPages);
      setTotal(response.meta.total);
      setError(null);
    } catch (err) {
      setError('Failed to load incidents');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateIncident = async (data: CreateIncidentDto) => {
    isCreatingRef.current = true;
    try {
      const newIncident = await api.createIncident(data);
      
      toast.success('Incident created successfully');
      if (page !== 1) {
        setPage(1);
      } else {
        loadIncidents();
      }
      
      setTimeout(() => {
        isCreatingRef.current = false;
        console.log('Create flag cleared');
      }, 2000);
    } catch (err) {
      console.error('Failed to create incident:', err);
      toast.error('Failed to create incident');
      isCreatingRef.current = false;
    }
  };

  const handleStatusChange = async (id: string, status: IncidentStatus) => {
    try {
      await api.updateIncident(id, { status });
      toast.success('Status updated successfully');
    } catch (err) {
      console.error('Failed to update incident:', err);
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteIncident(id);
      toast.success('Incident deleted successfully');
    } catch (err) {
      console.error('Failed to delete incident:', err);
      toast.error('Failed to delete incident');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="mb-10">
          <h1 className="text-5xl font-bold mb-3">Incident Management Dashboard</h1>
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 w-3 h-3 bg-emerald-500 rounded-full animate-ping"></div>
            </div>
            <p className="text-muted-foreground text-lg">
              Real-time incident tracking and management system
            </p>
          </div>
        </div>

        <CreateIncidentForm 
          open={isModalOpen} 
          onOpenChange={setIsModalOpen}
          onSubmit={handleCreateIncident} 
        />

        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
              <p className="mt-6 text-muted-foreground text-lg">Loading incidents...</p>
            </div>
          ) : error ? (
            <div className="flex items-center gap-3 p-5 bg-destructive/10 text-destructive rounded-lg">
              <AlertCircle className="h-6 w-6" />
              <p className="text-base">{error}</p>
            </div>
          ) : incidents.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed rounded-lg">
              <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg mb-6">No incidents found. Create one to get started!</p>
              <Button 
                onClick={() => setIsModalOpen(true)} 
                className="h-11 text-base cursor-pointer px-6"
              >
                <Plus className="mr-2 h-5 w-5" />
                Create Incident
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <p className="text-muted-foreground text-base">
                  Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} incidents
                </p>
                <Button 
                  onClick={() => setIsModalOpen(true)} 
                  className="h-11 text-base cursor-pointer px-6"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Create Incident
                </Button>
              </div>

              <IncidentTable
                incidents={incidents}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
                newIncidentId={newIncidentId}
              />

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="cursor-pointer"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <Button
                        key={pageNum}
                        variant={page === pageNum ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setPage(pageNum)}
                        className="cursor-pointer min-w-[40px]"
                      >
                        {pageNum}
                      </Button>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="cursor-pointer"
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
