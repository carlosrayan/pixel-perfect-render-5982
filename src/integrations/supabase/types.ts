export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      analyses: {
        Row: {
          categories: Json
          created_at: string
          id: string
          job_id: string
          result: Json
          score: number
          user_id: string
        }
        Insert: {
          categories?: Json
          created_at?: string
          id?: string
          job_id: string
          result?: Json
          score?: number
          user_id: string
        }
        Update: {
          categories?: Json
          created_at?: string
          id?: string
          job_id?: string
          result?: Json
          score?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "analyses_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          company: string | null
          created_at: string
          description: string
          id: string
          location: string | null
          parsed: Json
          status: string
          title: string
          updated_at: string
          url: string | null
          user_id: string
          work_model: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string
          description: string
          id?: string
          location?: string | null
          parsed?: Json
          status?: string
          title: string
          updated_at?: string
          url?: string | null
          user_id: string
          work_model?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string
          description?: string
          id?: string
          location?: string | null
          parsed?: Json
          status?: string
          title?: string
          updated_at?: string
          url?: string | null
          user_id?: string
          work_model?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          certifications: Json
          created_at: string
          current_position: string | null
          desired_position: string | null
          education: Json
          email: string | null
          experiences: Json
          full_name: string | null
          headline: string | null
          id: string
          languages: Json
          links: Json
          location: string | null
          onboarding_completed: boolean
          phone: string | null
          projects: Json
          salary_expectation: string | null
          skills: Json
          summary: string | null
          updated_at: string
          work_model: string | null
        }
        Insert: {
          certifications?: Json
          created_at?: string
          current_position?: string | null
          desired_position?: string | null
          education?: Json
          email?: string | null
          experiences?: Json
          full_name?: string | null
          headline?: string | null
          id: string
          languages?: Json
          links?: Json
          location?: string | null
          onboarding_completed?: boolean
          phone?: string | null
          projects?: Json
          salary_expectation?: string | null
          skills?: Json
          summary?: string | null
          updated_at?: string
          work_model?: string | null
        }
        Update: {
          certifications?: Json
          created_at?: string
          current_position?: string | null
          desired_position?: string | null
          education?: Json
          email?: string | null
          experiences?: Json
          full_name?: string | null
          headline?: string | null
          id?: string
          languages?: Json
          links?: Json
          location?: string | null
          onboarding_completed?: boolean
          phone?: string | null
          projects?: Json
          salary_expectation?: string | null
          skills?: Json
          summary?: string | null
          updated_at?: string
          work_model?: string | null
        }
        Relationships: []
      }
      resumes: {
        Row: {
          analysis_id: string | null
          changes: Json
          content: Json
          created_at: string
          id: string
          is_master: boolean
          job_id: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          analysis_id?: string | null
          changes?: Json
          content?: Json
          created_at?: string
          id?: string
          is_master?: boolean
          job_id?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          analysis_id?: string | null
          changes?: Json
          content?: Json
          created_at?: string
          id?: string
          is_master?: boolean
          job_id?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "resumes_analysis_id_fkey"
            columns: ["analysis_id"]
            isOneToOne: false
            referencedRelation: "analyses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resumes_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
