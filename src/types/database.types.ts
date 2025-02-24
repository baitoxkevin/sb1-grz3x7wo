export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          role: string;
          is_super_admin: boolean;
          raw_user_meta_data: {
            is_super_admin: boolean;
            full_name: string;
            email_verified: boolean;
          };
          created_at: string;
          updated_at: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: 'mention' | 'assignment' | 'update';
          task_id?: string;
          project_id?: string;
          title: string;
          message: string;
          read: boolean;
          created_at: string;
        };
      };
      candidates: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          phone_number: string;
          status: 'available' | 'unavailable' | 'pending';
          rating: number;
          skills: string[];
          experience_years: number;
          preferred_locations: string[];
          created_at: string;
          last_active_at: string;
          completed_projects: number;
          gender: 'male' | 'female' | 'other';
          nationality: string;
          emergency_contact_name: string;
          emergency_contact_number: string;
          bank_name: string;
          bank_account_number: string;
          highest_education: string;
          has_vehicle: boolean;
          vehicle_type: string;
          is_banned: boolean;
          updated_at: string;
        };
      };
      photos: {
        Row: {
          id: string;
          candidate_id: string;
          full_body_url: string;
          half_body_url: string;
          profile_photo_url: string;
          upload_date: string;
          is_verified: boolean;
        };
      };
      experience: {
        Row: {
          id: string;
          candidate_id: string;
          skill_name: string;
          years_experience: number;
          certification_url: string;
          is_verified: boolean;
          created_at: string;
        };
      };
      performance_metrics: {
        Row: {
          id: string;
          candidate_id: string;
          reliability_score: number;
          response_rate: number;
          avg_rating: number;
          total_gigs_completed: number;
          no_shows: number;
          late_arrivals: number;
          early_terminations: number;
          category_ratings: Record<string, number>;
          last_updated: string;
        };
      };
    };
    Enums: {
      user_role: 'admin' | 'user';
      candidate_status: 'available' | 'unavailable' | 'pending';
      gender_type: 'male' | 'female' | 'other';
    };
  };
}
