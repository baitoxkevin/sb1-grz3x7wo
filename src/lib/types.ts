export type UserRole = 'super_admin' | 'admin' | 'manager' | 'client' | 'staff';

export type TaskStatus = 'backlog' | 'todo' | 'doing' | 'done';

export type AdminRole = 'super_admin' | 'admin';

export interface AdminUser extends User {
  role: AdminRole;
  is_super_admin: boolean;
}

export interface Company {
  id: string;
  name: string;
  contact_email: string;
  contact_phone?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

export interface Invite {
  id: string;
  email: string;
  role: UserRole;
  company_id?: string;
  expires_at: string;
  created_at: string;
  created_by: string;
  status: 'pending' | 'accepted' | 'expired';
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  is_super_admin: boolean;
  company_name?: string;
  contact_phone?: string;
  created_at: string;
  updated_at: string;
  raw_user_meta_data?: Record<string, unknown>;
  raw_app_meta_data?: Record<string, unknown>;
}

export interface Candidate {
  id: string;
  full_name: string;
  ic_number: string;
  date_of_birth: string;
  phone_number: string;
  gender: 'male' | 'female' | 'other';
  email: string;
  nationality: string;
  emergency_contact_name: string;
  emergency_contact_number: string;
  bank_name?: string;
  bank_account_number?: string;
  highest_education?: string;
  has_vehicle: boolean;
  vehicle_type?: string;
  is_banned: boolean;
  created_at: string;
  updated_at: string;
  performance_metrics?: {
    reliability_score: number;
    response_rate: number;
    avg_rating: number;
    total_gigs_completed: number;
    no_shows: number;
    late_arrivals: number;
    early_terminations: number;
    category_ratings: Record<string, number>;
  };
  loyalty_status?: {
    tier_level: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
    current_points: number;
    total_gigs_completed: number;
    tier_achieved_date: string;
    points_expiry_date: string;
    fast_track_eligible: boolean;
  };
  latest_ban?: {
    ban_reason: string;
    ban_date: string;
    is_permanent: boolean;
  };
}

export interface Project {
  id: string;
  title: string;
  client_id?: string;
  manager_id?: string;
  status: string;
  priority: string;
  start_date: string;
  end_date: string | null;
  crew_count: number;
  filled_positions: number;
  working_hours_start: string;
  working_hours_end: string;
  event_type: string;
  venue_address: string;
  venue_details?: string;
  supervisors_required: number;
  color: string;
  deleted_at?: string;
  deleted_by?: string;
  created_at: string;
  updated_at: string;
  client?: User;
  manager?: User;
}
