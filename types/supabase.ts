// Supabase database types
// Generate with: npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/supabase.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          avatar_url: string | null
          bio: string | null
          level: string | null
          favorite_sports: string[] | null
          location: string | null
          onboarding_completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          email: string
          phone?: string | null
          avatar_url?: string | null
          bio?: string | null
          level?: string | null
          favorite_sports?: string[] | null
          location?: string | null
          onboarding_completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          avatar_url?: string | null
          bio?: string | null
          level?: string | null
          favorite_sports?: string[] | null
          location?: string | null
          onboarding_completed?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      courts: {
        Row: {
          id: string
          name: string
          description: string | null
          address: string
          city: string
          state: string
          latitude: number
          longitude: number
          sport: string
          sports: string[]
          price_per_hour: number
          rating: number
          review_count: number
          images: string[]
          amenities: string[]
          owner_id: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          address: string
          city: string
          state: string
          latitude: number
          longitude: number
          sport: string
          sports: string[]
          price_per_hour: number
          rating?: number
          review_count?: number
          images?: string[]
          amenities?: string[]
          owner_id: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          address?: string
          city?: string
          state?: string
          latitude?: number
          longitude?: number
          sport?: string
          sports?: string[]
          price_per_hour?: number
          rating?: number
          review_count?: number
          images?: string[]
          amenities?: string[]
          owner_id?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          user_id: string
          court_id: string
          date: string
          start_time: string
          end_time: string
          duration_minutes: number
          price: number
          status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          payment_status: 'pending' | 'paid' | 'refunded'
          payment_method: string | null
          payment_id: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          court_id: string
          date: string
          start_time: string
          end_time: string
          duration_minutes: number
          price: number
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          payment_status?: 'pending' | 'paid' | 'refunded'
          payment_method?: string | null
          payment_id?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          court_id?: string
          date?: string
          start_time?: string
          end_time?: string
          duration_minutes?: number
          price?: number
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          payment_status?: 'pending' | 'paid' | 'refunded'
          payment_method?: string | null
          payment_id?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      booking_players: {
        Row: {
          id: string
          booking_id: string
          user_id: string
          status: 'invited' | 'confirmed' | 'declined'
          created_at: string
        }
        Insert: {
          id?: string
          booking_id: string
          user_id: string
          status?: 'invited' | 'confirmed' | 'declined'
          created_at?: string
        }
        Update: {
          id?: string
          booking_id?: string
          user_id?: string
          status?: 'invited' | 'confirmed' | 'declined'
          created_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          user_id: string
          court_id: string
          booking_id: string | null
          rating: number
          comment: string | null
          helpful_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          court_id: string
          booking_id?: string | null
          rating: number
          comment?: string | null
          helpful_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          court_id?: string
          booking_id?: string | null
          rating?: number
          comment?: string | null
          helpful_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      conversations: {
        Row: {
          id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
        }
      }
      conversation_participants: {
        Row: {
          id: string
          conversation_id: string
          user_id: string
          last_read_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          user_id: string
          last_read_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          user_id?: string
          last_read_at?: string | null
          created_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          sender_id: string
          content: string
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          sender_id: string
          content: string
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          sender_id?: string
          content?: string
          read?: boolean
          created_at?: string
        }
      }
      friendships: {
        Row: {
          id: string
          user_id: string
          friend_id: string
          status: 'pending' | 'accepted' | 'rejected'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          friend_id: string
          status?: 'pending' | 'accepted' | 'rejected'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          friend_id?: string
          status?: 'pending' | 'accepted' | 'rejected'
          created_at?: string
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          title: string
          message: string
          data: Json | null
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          title: string
          message: string
          data?: Json | null
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          title?: string
          message?: string
          data?: Json | null
          read?: boolean
          created_at?: string
        }
      }
      push_tokens: {
        Row: {
          id: string
          user_id: string
          token: string
          platform: 'ios' | 'android'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          token: string
          platform: 'ios' | 'android'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          token?: string
          platform?: 'ios' | 'android'
          created_at?: string
          updated_at?: string
        }
      }
      rankings: {
        Row: {
          id: string
          user_id: string
          sport: string
          points: number
          rank: number
          wins: number
          losses: number
          win_rate: number
          matches_played: number
          trend: 'up' | 'down' | 'stable'
          previous_rank: number
          best_rank: number
          current_streak: number
          longest_streak: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          sport: string
          points?: number
          rank?: number
          wins?: number
          losses?: number
          win_rate?: number
          matches_played?: number
          trend?: 'up' | 'down' | 'stable'
          previous_rank?: number
          best_rank?: number
          current_streak?: number
          longest_streak?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          sport?: string
          points?: number
          rank?: number
          wins?: number
          losses?: number
          win_rate?: number
          matches_played?: number
          trend?: 'up' | 'down' | 'stable'
          previous_rank?: number
          best_rank?: number
          current_streak?: number
          longest_streak?: number
          created_at?: string
          updated_at?: string
        }
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          court_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          court_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          court_id?: string
          created_at?: string
        }
      },
      matches: {
        Row: {
          id: string
          organizer_id: string
          court_id: string | null
          sport: string
          start_time: string
          is_private: boolean
          status: string
          max_players: number
          type: string
          player1_id: string
          is_public: boolean
          duration: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organizer_id: string
          court_id?: string | null
          sport: string
          start_time: string
          is_private?: boolean
          status?: string
          max_players: number
          type?: string
          player1_id?: string
          is_public?: boolean
          duration?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organizer_id?: string
          court_id?: string | null
          sport?: string
          start_time?: string
          is_private?: boolean
          status?: string
          max_players?: number
          type?: string
          player1_id?: string
          is_public?: boolean
          duration?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      match_players: {
        Row: {
          id: string
          match_id: string
          user_id: string
          status: string
          team: string | null
          created_at: string
        }
        Insert: {
          id?: string
          match_id: string
          user_id: string
          status: string
          team?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          match_id?: string
          user_id?: string
          status?: string
          team?: string | null
          created_at?: string
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

// Helper types
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Court = Database['public']['Tables']['courts']['Row']
export type Booking = Database['public']['Tables']['bookings']['Row']
export type Review = Database['public']['Tables']['reviews']['Row']
export type Conversation = Database['public']['Tables']['conversations']['Row']
export type Message = Database['public']['Tables']['messages']['Row']
export type Notification = Database['public']['Tables']['notifications']['Row']
export type Ranking = Database['public']['Tables']['rankings']['Row']
export type Friendship = Database['public']['Tables']['friendships']['Row']
export type Favorite = Database['public']['Tables']['favorites']['Row']
export type Match = Database['public']['Tables']['matches']['Row']
export type MatchPlayer = Database['public']['Tables']['match_players']['Row']

// Insert types
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type CourtInsert = Database['public']['Tables']['courts']['Insert']
export type BookingInsert = Database['public']['Tables']['bookings']['Insert']
export type ReviewInsert = Database['public']['Tables']['reviews']['Insert']
export type MessageInsert = Database['public']['Tables']['messages']['Insert']

// Update types
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']
export type CourtUpdate = Database['public']['Tables']['courts']['Update']
export type BookingUpdate = Database['public']['Tables']['bookings']['Update']
