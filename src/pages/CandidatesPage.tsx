import { useState, useEffect, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  PlusIcon, 
  Search, 
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
// Removed unused import
import type { Candidate } from '@/lib/types';
import NewCandidateDialog from '@/components/NewCandidateDialog';

// Removed unused color mapping

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newDialogOpen, setNewDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const loadCandidates = useCallback(async () => {
    try {
      console.log('Fetching candidates...');
      const { data, error } = await supabase
        .from('candidates')
        .select(`
          *,
          performance_metrics (
            reliability_score,
            response_rate,
            avg_rating,
            total_gigs_completed
          ),
          loyalty_status (
            tier_level,
            current_points
          )
        `)
        .limit(100)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Candidates data:', data);

      if (!data || data.length === 0) {
        console.log('No candidates found in the database');
        toast({
          title: 'No candidates',
          description: 'No candidates found in the database.',
        });
      }

      setCandidates(data || []);
    } catch (error) {
      console.error('Error loading candidates:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to load candidates. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadCandidates();
  }, [loadCandidates]);

  const filteredCandidates = candidates.filter(candidate =>
    candidate.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    candidate.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    candidate.phone_number.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 p-2 sm:p-4 rounded-none md:rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold">Candidates</h1>
          <Badge variant="secondary" className="ml-2">
            {candidates.length}
          </Badge>
        </div>
        <div className="flex-1 relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search candidates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 w-full"
          />
        </div>
        <Button 
          className="w-full sm:w-auto"
          onClick={() => setNewDialogOpen(true)}
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Candidate
        </Button>
      </div>

      <div className="bg-background">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Balance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCandidates.map((candidate) => (
              <TableRow key={candidate.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img
                      className="rounded-full"
                      src={`https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=${candidate.id}`}
                      width={40}
                      height={40}
                      alt={candidate.full_name}
                    />
                    <div>
                      <div className="font-medium">{candidate.full_name}</div>
                      <div className="mt-0.5 text-xs text-muted-foreground">
                        {candidate.phone_number}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{candidate.email}</TableCell>
                <TableCell>{candidate.nationality}</TableCell>
                <TableCell>
                  {candidate.is_banned ? "Banned" : "Active"}
                </TableCell>
                <TableCell className="text-right">
                  {candidate.loyalty_status?.current_points || 0} points
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filteredCandidates.length === 0 && (
          <div className="py-6 text-center text-sm text-muted-foreground">
            No results found. Try adjusting your search.
          </div>
        )}
      </div>
      <NewCandidateDialog
        open={newDialogOpen}
        onOpenChange={setNewDialogOpen}
        onCandidateAdded={loadCandidates}
      />
    </div>
  );
}
