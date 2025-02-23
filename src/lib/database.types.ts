export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      documents: {
        Row: {
          id: string
          name: string
          type: string
          size: number
          folder: string
          storage_path: string
          owner_id: string
          document_type?: 'project_pl' | 'project_claim' | 'project_proposal' | 'briefing_deck'
          project_id?: string
          shared_with: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          type: string
          size: number
          folder: string
          storage_path: string
          owner_id: string
          document_type?: 'project_pl' | 'project_claim' | 'project_proposal' | 'briefing_deck'
          project_id?: string
          shared_with?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: string
          size?: number
          folder?: string
          storage_path?: string
          owner_id?: string
          document_type?: 'project_pl' | 'project_claim' | 'project_proposal' | 'briefing_deck'
          project_id?: string
          shared_with?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          role: string
          is_super_admin: boolean | null
          created_at: string
          updated_at: string
          raw_user_meta_data: {
            is_super_admin: boolean
            email_verified: boolean
            full_name?: string
          } | null
          raw_app_meta_data: {
            provider: string
            providers: string[]
            role?: string
          } | null
        }
        Insert: {
          id?: string
          email: string
          role?: string
          is_super_admin?: boolean | null
          created_at?: string
          updated_at?: string
          raw_user_meta_data?: {
            is_super_admin?: boolean
            email_verified?: boolean
            full_name?: string
          } | null
          raw_app_meta_data?: {
            provider?: string
            providers?: string[]
            role?: string
          } | null
        }
        Update: {
          id?: string
          email?: string
          role?: string
          is_super_admin?: boolean | null
          created_at?: string
          updated_at?: string
          raw_user_meta_data?: {
            is_super_admin?: boolean
            email_verified?: boolean
            full_name?: string
          } | null
          raw_app_meta_data?: {
            provider?: string
            providers?: string[]
            role?: string
          } | null
        }
      }
      documents: {
        Row: {
          id: string
          name: string
          type: string
          size: number
          folder: string
          storage_path: string
          owner_id: string
          document_type?: 'project_pl' | 'project_claim' | 'project_proposal' | 'briefing_deck'
          project_id?: string
          shared_with: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          type: string
          size: number
          folder: string
          storage_path: string
          owner_id: string
          document_type?: 'project_pl' | 'project_claim' | 'project_proposal' | 'briefing_deck'
          project_id?: string
          shared_with?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: string
          size?: number
          folder?: string
          storage_path?: string
          owner_id?: string
          document_type?: 'project_pl' | 'project_claim' | 'project_proposal' | 'briefing_deck'
          project_id?: string
          shared_with?: string[]
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
