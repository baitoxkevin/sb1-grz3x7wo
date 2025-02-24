import * as React from "react";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Database } from "@/types/database.types";

// Add global styles
import "../index.css";

interface CandidateTableProps {
  candidates: Database['public']['Tables']['candidates']['Row'][];
  onViewProfile: (candidate: Database['public']['Tables']['candidates']['Row']) => void;
}

export function CandidateTable({ candidates, onViewProfile }: CandidateTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Phone</TableCell>
          <TableCell>Rating</TableCell>
          <TableCell>Projects</TableCell>
          <TableCell>Actions</TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {candidates.map((candidate) => (
          <TableRow key={candidate.id}>
            <TableCell className="flex items-center gap-2">
              <Avatar className={cn(
                "ring-2",
                candidate.gender === 'female' ? "ring-[#DBADFF]" : 
                candidate.gender === 'male' ? "ring-[#5484ED]" : 
                "ring-[#E1E1E1]"
              )}>
                <AvatarFallback>
                  {candidate.full_name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              {candidate.full_name}
            </TableCell>
            <TableCell>{candidate.phone_number}</TableCell>
            <TableCell>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-[#FBD75B] text-[#FBD75B]" />
                {candidate.rating.toFixed(1)}
              </div>
            </TableCell>
            <TableCell>{candidate.completed_projects}</TableCell>
            <TableCell>
              <Button 
                variant="ghost" 
                onClick={() => onViewProfile(candidate)}
              >
                View Profile
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
