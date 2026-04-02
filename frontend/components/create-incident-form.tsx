'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CreateIncidentDto, IncidentSeverity } from '@/lib/types';

interface CreateIncidentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateIncidentDto) => void;
}

export function CreateIncidentForm({ open, onOpenChange, onSubmit }: CreateIncidentFormProps) {
  const [formData, setFormData] = useState<CreateIncidentDto>({
    title: '',
    description: '',
    service: '',
    severity: IncidentSeverity.MEDIUM,
  });
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
    service?: string;
  }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData.service.trim()) {
      newErrors.service = 'Service is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    onSubmit(formData);
    setFormData({
      title: '',
      description: '',
      service: '',
      severity: IncidentSeverity.MEDIUM,
    });
    setErrors({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Create New Incident</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label className="text-base font-medium mb-2 block">Title</label>
            <Input
              value={formData.title}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value });
                if (errors.title) setErrors({ ...errors, title: undefined });
              }}
              placeholder="Brief description of the incident"
              className="text-base h-11 cursor-text"
            />
            {errors.title && (
              <p className="text-sm text-red-600 mt-1">{errors.title}</p>
            )}
          </div>

          <div>
            <label className="text-base font-medium mb-2 block">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => {
                setFormData({ ...formData, description: e.target.value });
                if (errors.description) setErrors({ ...errors, description: undefined });
              }}
              placeholder="Detailed description of the incident"
              rows={4}
              className="text-base cursor-text"
            />
            {errors.description && (
              <p className="text-sm text-red-600 mt-1">{errors.description}</p>
            )}
          </div>

          <div>
            <label className="text-base font-medium mb-2 block">Service</label>
            <Input
              value={formData.service}
              onChange={(e) => {
                setFormData({ ...formData, service: e.target.value });
                if (errors.service) setErrors({ ...errors, service: undefined });
              }}
              placeholder="e.g., Payment API, Auth Service"
              className="text-base h-11 cursor-text"
            />
            {errors.service && (
              <p className="text-sm text-red-600 mt-1">{errors.service}</p>
            )}
          </div>

          <div>
            <label className="text-base font-medium mb-2 block">Severity</label>
            <Select
              value={formData.severity}
              onValueChange={(value) => setFormData({ ...formData, severity: value as IncidentSeverity })}
            >
              <SelectTrigger className="w-full h-11 text-base cursor-pointer">
                <SelectValue>
                  {formData.severity.charAt(0).toUpperCase() + formData.severity.slice(1)}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={IncidentSeverity.LOW}>Low</SelectItem>
                <SelectItem value={IncidentSeverity.MEDIUM}>Medium</SelectItem>
                <SelectItem value={IncidentSeverity.HIGH}>High</SelectItem>
                <SelectItem value={IncidentSeverity.CRITICAL}>Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="submit" className="flex-1 h-11 text-base cursor-pointer">
              Create Incident
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)} 
              className="h-11 text-base cursor-pointer"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
