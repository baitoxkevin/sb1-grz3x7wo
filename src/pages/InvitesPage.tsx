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
import { PlusIcon, Search, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';
import type { Invite } from '@/lib/types';

const statusColors = {
  pending: 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20',
  accepted: 'bg-green-500/10 text-green-500 hover:bg-green-500/20',
  expired: 'bg-red-500/10 text-red-500 hover:bg-red-500/20',
} as const;

export default function InvitesPage() {
  const [invites, setInvites] = useState<Invite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const loadInvites = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('invites')
        .select(`
          *,
          company:company_id(name),
          created_by_user:created_by(full_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInvites(data || []);
    } catch (error) {
      console.error('Error loading invites:', error);
      toast({
        title: 'Error',
        description: 'Failed to load invites. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadInvites();
  }, [loadInvites]);

  const filteredInvites = invites.filter(invite =>
    invite.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-background rounded-lg border border-border h-full overflow-auto">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search invites..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button>
          <PlusIcon className="h-4 w-4 mr-2" />
          Send Invite
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>Email</TableHeaderCell>
              <TableHeaderCell>Role</TableHeaderCell>
              <TableHeaderCell>Company</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Expires</TableHeaderCell>
              <TableHeaderCell>Created By</TableHeaderCell>
              <TableHeaderCell className="text-right">Actions</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvites.map((invite) => (
              <TableRow key={invite.id}>
                <TableCell className="font-medium">{invite.email}</TableCell>
                <TableCell className="capitalize">{invite.role}</TableCell>
                <TableCell>-</TableCell>
                <TableCell>
                  <Badge variant="secondary" className={statusColors[invite.status]}>
                    {invite.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {format(new Date(invite.expires_at), 'MMM d, yyyy')}
                </TableCell>
                <TableCell>{invite.created_by}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    Resend
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filteredInvites.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No invites found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
