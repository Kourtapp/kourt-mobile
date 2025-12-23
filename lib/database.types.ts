
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      arenas: {
        Row: {
          address: string | null
          amenities: string[] | null
          city: string | null
          cover_photo_url: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          owner_id: string | null
          phone: string | null
          state: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          amenities?: string[] | null
          city?: string | null
          cover_photo_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          owner_id?: string | null
          phone?: string | null
          state?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          amenities?: string[] | null
          city?: string | null
          cover_photo_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          owner_id?: string | null
          phone?: string | null
          state?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "arenas_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      court_checkins: {
        Row: {
          checkin_date: string
          court_id: string
          created_at: string | null
          id: string
          status: string | null
          time_slot: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          checkin_date: string
          court_id: string
          created_at?: string | null
          id?: string
          status?: string | null
          time_slot: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          checkin_date?: string
          court_id?: string
          created_at?: string | null
          id?: string
          status?: string | null
          time_slot?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "court_checkins_court_id_fkey"
            columns: ["court_id"]
            isOneToOne: false
            referencedRelation: "courts"
            referencedColumns: ["id"]
          },
        ]
      }
      courts: {
        Row: {
          arena_id: string | null
          cover_image: string | null
          created_at: string
          description: string | null
          id: string
          images: string[] | null
          is_indoor: boolean | null
          name: string
          owner_id: string | null
          price_per_hour: number | null
          rating: number | null
          rating_count: number | null
          sport: string
          surface: string | null
          type: string | null
          updated_at: string
        }
        Insert: {
          arena_id?: string | null
          cover_image?: string | null
          created_at?: string
          description?: string | null
          id?: string
          images?: string[] | null
          is_indoor?: boolean | null
          name: string
          owner_id?: string | null
          price_per_hour?: number | null
          rating?: number | null
          rating_count?: number | null
          sport: string
          surface?: string | null
          type?: string | null
          updated_at?: string
        }
        Update: {
          arena_id?: string | null
          cover_image?: string | null
          created_at?: string
          description?: string | null
          id?: string
          images?: string[] | null
          is_indoor?: boolean | null
          name?: string
          owner_id?: string | null
          price_per_hour?: number | null
          rating?: number | null
          rating_count?: number | null
          sport?: string
          surface?: string | null
          type?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "courts_arena_id_fkey"
            columns: ["arena_id"]
            isOneToOne: false
            referencedRelation: "arenas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "courts_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      follows: {
        Row: {
          created_at: string | null
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string | null
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string | null
          follower_id?: string
          following_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "follows_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follows_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      match_invites: {
        Row: {
          created_at: string
          id: string
          match_id: string
          recipient_id: string
          sender_id: string
          status: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          match_id: string
          recipient_id: string
          sender_id: string
          status?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          match_id?: string
          recipient_id?: string
          sender_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "match_invites_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_invites_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_invites_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      match_players: {
        Row: {
          id: string
          joined_at: string
          match_id: string
          status: string | null
          team: string | null
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string
          match_id: string
          status?: string | null
          team?: string | null
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string
          match_id?: string
          status?: string | null
          team?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "match_players_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_players_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      matches: {
        Row: {
          court_id: string | null
          created_at: string
          current_players: number | null
          date: string
          description: string | null
          end_time: string
          id: string
          is_private: boolean | null
          is_public: boolean | null
          level: string | null
          location_address: string | null
          location_name: string | null
          max_players: number | null
          organizer_id: string | null
          price_per_person: number | null
          sport: string
          start_time: string
          status: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          court_id?: string | null
          created_at?: string
          current_players?: number | null
          date: string
          description?: string | null
          end_time: string
          id?: string
          is_private?: boolean | null
          is_public?: boolean | null
          level?: string | null
          location_address?: string | null
          location_name?: string | null
          max_players?: number | null
          organizer_id?: string | null
          price_per_person?: number | null
          sport: string
          start_time: string
          status?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          court_id?: string | null
          created_at?: string
          current_players?: number | null
          date?: string
          description?: string | null
          end_time?: string
          id?: string
          is_private?: boolean | null
          is_public?: boolean | null
          level?: string | null
          location_address?: string | null
          location_name?: string | null
          max_players?: number | null
          organizer_id?: string | null
          price_per_person?: number | null
          sport?: string
          start_time?: string
          status?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "matches_court_id_fkey"
            columns: ["court_id"]
            isOneToOne: false
            referencedRelation: "courts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      post_comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          likes_count: number | null
          parent_id: string | null
          post_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          likes_count?: number | null
          parent_id?: string | null
          post_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          likes_count?: number | null
          parent_id?: string | null
          post_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "post_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      post_likes: {
        Row: {
          created_at: string | null
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          comments_count: number | null
          content: string | null
          created_at: string
          id: string
          image_url: string | null
          likes_count: number | null
          metrics: Json | null
          photo_url: string | null
          type: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          comments_count?: number | null
          content?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          likes_count?: number | null
          metrics?: Json | null
          photo_url?: string | null
          type?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          comments_count?: number | null
          content?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          likes_count?: number | null
          metrics?: Json | null
          photo_url?: string | null
          type?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      professional_services: {
        Row: {
          category: Database["public"]["Enums"]["service_category"]
          created_at: string | null
          description: string | null
          duration_minutes: number | null
          id: string
          is_active: boolean | null
          price_cents: number
          professional_id: string
          title: string
        }
        Insert: {
          category: Database["public"]["Enums"]["service_category"]
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_active?: boolean | null
          price_cents: number
          professional_id: string
          title: string
        }
        Update: {
          category?: Database["public"]["Enums"]["service_category"]
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_active?: boolean | null
          price_cents?: number
          professional_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "professional_services_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
        ]
      }
      professionals: {
        Row: {
          bio: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          profile_image_url: string | null
          qualifications: string | null
          specialties: string[] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          profile_image_url?: string | null
          qualifications?: string | null
          specialties?: string[] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          profile_image_url?: string | null
          qualifications?: string | null
          specialties?: string[] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          cover_url: string | null
          created_at: string
          followers_count: number | null
          following_count: number | null
          full_name: string | null
          id: string
          is_verified: boolean | null
          latitude: number | null
          longitude: number | null
          losses: number | null
          main_goal: string | null
          matches_count: number | null
          matches_played: number | null
          play_frequency: string | null
          play_style: string | null
          rating: number | null
          skill_level: string | null
          stripe_customer_id: string | null
          updated_at: string
          username: string | null
          wins: number | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          cover_url?: string | null
          created_at?: string
          followers_count?: number | null
          following_count?: number | null
          full_name?: string | null
          id: string
          is_verified?: boolean | null
          latitude?: number | null
          longitude?: number | null
          losses?: number | null
          main_goal?: string | null
          matches_count?: number | null
          matches_played?: number | null
          play_frequency?: string | null
          play_style?: string | null
          rating?: number | null
          skill_level?: string | null
          stripe_customer_id?: string | null
          updated_at?: string
          username?: string | null
          wins?: number | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          cover_url?: string | null
          created_at?: string
          followers_count?: number | null
          following_count?: number | null
          full_name?: string | null
          id?: string
          is_verified?: boolean | null
          latitude?: number | null
          longitude?: number | null
          losses?: number | null
          main_goal?: string | null
          matches_count?: number | null
          matches_played?: number | null
          play_frequency?: string | null
          play_style?: string | null
          rating?: number | null
          skill_level?: string | null
          stripe_customer_id?: string | null
          updated_at?: string
          username?: string | null
          wins?: number | null
        }
        Relationships: []
      }
      team_members: {
        Row: {
          id: string
          joined_at: string
          role: string
          team_id: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string
          role?: string
          team_id: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string
          role?: string
          team_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          avatar_url: string | null
          captain_id: string
          cover_url: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          sport: string
          stats: Json | null
        }
        Insert: {
          avatar_url?: string | null
          captain_id: string
          cover_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          sport: string
          stats?: Json | null
        }
        Update: {
          avatar_url?: string | null
          captain_id?: string
          cover_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          sport?: string
          stats?: Json | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_distance_km: {
        Args: { lat1: number; lat2: number; lon1: number; lon2: number }
        Returns: number
      }
    }
    Enums: {
      service_category:
      | "personal_trainer"
      | "sports_coach"
      | "nutritionist"
      | "physiotherapist"
      | "masseuse"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
    DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
  : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
  : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
  : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
  : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
  : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      service_category: [
        "personal_trainer",
        "sports_coach",
        "nutritionist",
        "physiotherapist",
        "masseuse",
      ],
    },
  },
} as const

