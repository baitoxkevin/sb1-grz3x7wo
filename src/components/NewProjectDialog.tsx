import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface NewProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProjectAdded: () => void;
  initialDates: { start: Date; end: Date } | null;
}

export default function NewProjectDialog({
  open,
  onOpenChange,
  onProjectAdded,
  initialDates,
}: NewProjectDialogProps) {
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.from('projects').insert([
        {
          color: '#' + Math.floor(Math.random()*16777215).toString(16),
          title,
          start_date: initialDates?.start.toISOString(),
          end_date: initialDates?.end.toISOString(),
          event_type: 'other',
          working_hours_start: '09:00',
          working_hours_end: '17:00',
          crew_count: 1,
          filled_positions: 0,
          supervisors_required: 1,
          venue_address: '',
          status: 'draft',
          priority: 'medium',
        },
      ]);

      if (error) throw error;

      toast({
        title: 'Project created',
        description: 'The project has been successfully created.',
      });

      onProjectAdded();
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        title: 'Error',
        description: 'Failed to create project. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter project title"
              />
            </div>
            {/* Add more fields as needed */}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Project'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}