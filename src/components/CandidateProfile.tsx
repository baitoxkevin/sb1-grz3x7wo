import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Database } from "@/types/database.types";

interface CandidateProfileProps {
  candidate: Database['public']['Tables']['candidates']['Row'] | null;
  open: boolean;
  onClose: () => void;
}

export function CandidateProfile({ candidate, open, onClose }: CandidateProfileProps) {
  if (!candidate) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <Avatar className={cn(
              "w-16 h-16 ring-4",
              candidate.gender === 'female' ? "ring-[#DBADFF]" : 
              candidate.gender === 'male' ? "ring-[#5484ED]" : 
              "ring-[#E1E1E1]"
            )}>
              <AvatarFallback className="text-xl">
                {candidate.full_name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle>{candidate.full_name}</DialogTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={
                  candidate.status === 'available' ? 'success' :
                  candidate.status === 'unavailable' ? 'destructive' :
                  'secondary'
                }>
                  {candidate.status}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {candidate.completed_projects} projects completed
                </span>
              </div>
            </div>
          </div>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Contact</h4>
              <p className="text-sm">{candidate.phone_number}</p>
              <p className="text-sm">{candidate.email}</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Experience</h4>
              <p className="text-sm">{candidate.experience_years} years</p>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-2">Skills</h4>
            <div className="flex flex-wrap gap-2">
              {candidate.skills.map((skill) => (
                <Badge key={skill} variant="outline">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
